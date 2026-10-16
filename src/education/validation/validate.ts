import {
  CASE_SCENES, CEFR_LEVELS, CHARACTER_LOOKS, EVIDENCE_SPRITES, GAME_IDS, ICON_KEYS, SKILL_CATEGORIES,
  type CefrLevel, type ChallengeItem, type ContentBank, type DetectiveCase, type GameId,
} from '../types';

export interface ValidationIssue {
  id: string;
  message: string;
}

const GAME_CODES: Record<GameId, string> = {
  'grammar-blaster': 'gb',
  'word-jumper': 'wj',
  'tense-racer': 'tr',
  'english-detective': 'ed',
};

export const MAX_OPTION_LENGTH = 24;
const GAP = '___';

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
const isIndex = (n: unknown, len: number) => Number.isInteger(n) && (n as number) >= 0 && (n as number) < len;

function countGaps(s: string) {
  return s.split(GAP).length - 1;
}

/** Feedback must explain, not just repeat the answer. */
function weakFeedback(feedback: string, answer: string) {
  const f = norm(feedback).replace(/[.!"'“”]/g, '');
  const a = norm(answer).replace(/[.!"'“”]/g, '');
  return f.length < 15 || f === a || f.length <= a.length + 8;
}

function checkBase(item: ChallengeItem, bank: { game: GameId; level: CefrLevel }, out: ValidationIssue[]) {
  const id = item.id || '(missing id)';
  const add = (message: string) => out.push({ id, message });
  if (!item.id || !/^[a-z0-9-]+$/.test(item.id)) add('id must be lowercase letters, numbers and dashes');
  const prefix = `${GAME_CODES[bank.game]}-${bank.level.toLowerCase()}-`;
  if (item.id && !item.id.startsWith(prefix)) add(`id must start with "${prefix}" (level/game metadata mismatch)`);
  if (!CEFR_LEVELS.includes(item.level)) add(`invalid level "${item.level}"`);
  if (item.level !== bank.level) add(`level ${item.level} does not match bank level ${bank.level}`);
  if (!Array.isArray(item.games) || item.games.length === 0) add('games must list at least one game');
  else {
    for (const g of item.games) if (!GAME_IDS.includes(g)) add(`unknown game "${g}"`);
    if (!item.games.includes(bank.game)) add(`item is in the ${bank.game} bank but does not list that game`);
  }
  if (!item.objective?.trim()) add('missing objective');
  if (!(item.category in SKILL_CATEGORIES)) add(`unknown category "${item.category}"`);
  if (![1, 2, 3].includes(item.difficulty)) add('difficulty must be 1, 2 or 3');
  if (!item.feedback?.trim()) add('missing feedback');
  if (!Array.isArray(item.tags)) add('tags must be an array');
  if (item.status !== 'draft' && item.status !== 'reviewed') add('status must be draft or reviewed');
  if (item.asset?.image?.startsWith('icon:')) {
    const key = item.asset.image.slice(5);
    if (!(ICON_KEYS as readonly string[]).includes(key)) add(`unknown icon "${key}"`);
  }
}

export function validateItem(item: ChallengeItem, bank: { game: GameId; level: CefrLevel }): ValidationIssue[] {
  const out: ValidationIssue[] = [];
  const add = (message: string) => out.push({ id: item.id || '(missing id)', message });
  checkBase(item, bank, out);

  switch (item.kind) {
    case 'choice': {
      if (countGaps(item.prompt ?? '') !== 1) add('prompt must contain exactly one ___ gap');
      if (!Array.isArray(item.choices) || item.choices.length < 2 || item.choices.length > 4) {
        add('choice items need 2–4 options');
        break;
      }
      const seen = new Set<string>();
      for (const c of item.choices) {
        if (!c?.trim()) add('empty option');
        else if (c.length > MAX_OPTION_LENGTH) add(`option "${c}" is longer than ${MAX_OPTION_LENGTH} characters`);
        if (seen.has(norm(c))) add(`duplicate option "${c}"`);
        seen.add(norm(c));
      }
      if (!isIndex(item.answer, item.choices.length)) add(`answer ${item.answer} is not a valid option index`);
      else if (item.feedback && weakFeedback(item.feedback, item.choices[item.answer])) add('feedback only repeats the answer; explain why');
      break;
    }
    case 'order': {
      if (!Array.isArray(item.chunks) || item.chunks.length < 3 || item.chunks.length > 10) {
        add('order items need 3–10 chunks');
        break;
      }
      if (item.chunks.some((c) => !c?.trim())) add('empty chunk');
      const last = item.chunks[item.chunks.length - 1] ?? '';
      if (/[.?!]$/.test(last)) add('put the final punctuation in `punctuation`, not in the last chunk');
      if (!['.', '?', '!'].includes(item.punctuation)) add('punctuation must be . ? or !');
      if (item.chunks[0] && item.chunks[0][0] !== item.chunks[0][0].toUpperCase()) add('first chunk must start with a capital letter');
      const key = [...item.chunks].map(norm).sort().join('|');
      for (const alt of item.alternatives ?? []) {
        if ([...alt].map(norm).sort().join('|') !== key) add('alternative order is not a permutation of the chunks');
      }
      if (item.feedback && weakFeedback(item.feedback, item.chunks.join(' '))) add('feedback only repeats the sentence; explain why');
      break;
    }
    case 'category': {
      if (!item.prompt?.trim()) add('missing prompt');
      if (!Array.isArray(item.correct) || item.correct.length < 3 || item.correct.length > 5) add('category items need 3–5 correct words');
      if (!Array.isArray(item.distractors) || item.distractors.length < 3 || item.distractors.length > 5) add('category items need 3–5 distractors');
      const all = [...(item.correct ?? []), ...(item.distractors ?? [])].map(norm);
      if (new Set(all).size !== all.length) add('a word appears twice (or is both correct and a distractor)');
      for (const w of all) if (w.length > MAX_OPTION_LENGTH) add(`word "${w}" is too long`);
      for (const [word, icon] of Object.entries(item.icons ?? {})) {
        if (!all.includes(norm(word))) add(`icon given for "${word}", which is not in the item`);
        if (!(ICON_KEYS as readonly string[]).includes(icon)) add(`unknown icon "${icon}"`);
      }
      break;
    }
    case 'spell': {
      if (!/^[a-z]{3,10}$/.test(item.word ?? '')) add('word must be 3–10 lowercase letters');
      if (!item.clue?.trim()) add('missing clue');
      else if (item.word && norm(item.clue).includes(item.word)) add('clue gives the word away');
      if (!/^[a-z]{2,4}$/.test(item.decoys ?? '')) add('decoys must be 2–4 lowercase letters');
      else if ([...item.decoys].some((ch) => item.word.includes(ch))) add('a decoy letter is in the word');
      else if (new Set(item.decoys).size !== item.decoys.length) add('repeated decoy letter');
      break;
    }
    default:
      add(`unknown item kind "${(item as { kind?: string }).kind}"`);
  }
  return out;
}

export function validateCase(c: DetectiveCase, bankLevel: CefrLevel): ValidationIssue[] {
  const out: ValidationIssue[] = [];
  const add = (message: string) => out.push({ id: c.id || '(missing id)', message });
  const prefix = `ed-${bankLevel.toLowerCase()}-`;
  if (!c.id?.startsWith(prefix)) add(`id must start with "${prefix}"`);
  if (c.level !== bankLevel) add(`level ${c.level} does not match bank level ${bankLevel}`);
  if (!c.title?.trim()) add('missing title');
  if (!c.objective?.trim()) add('missing objective');
  if (![1, 2, 3].includes(c.difficulty)) add('difficulty must be 1, 2 or 3');
  if (c.status !== 'draft' && c.status !== 'reviewed') add('status must be draft or reviewed');
  if (!CASE_SCENES.includes(c.scene)) add(`unknown scene "${c.scene}"`);
  if (!Array.isArray(c.briefing) || c.briefing.length < 1 || c.briefing.length > 5) add('briefing needs 1–5 lines');

  const ids = new Set<string>();
  const dup = (id: string) => {
    if (ids.has(id)) add(`duplicate id "${id}" inside the case`);
    ids.add(id);
  };
  if (!Array.isArray(c.suspects) || c.suspects.length < 2 || c.suspects.length > 4) add('cases need 2–4 suspects');
  for (const s of c.suspects ?? []) {
    dup(s.id);
    if (!s.name?.trim() || !s.statement?.trim() || !s.role?.trim()) add(`suspect ${s.id} needs name, role and statement`);
    if (!CHARACTER_LOOKS.includes(s.look)) add(`suspect ${s.id} has unknown look "${s.look}"`);
  }
  if (!Array.isArray(c.evidence) || c.evidence.length < 3 || c.evidence.length > 7) add('cases need 3–7 pieces of evidence');
  for (const e of c.evidence ?? []) {
    dup(e.id);
    if (!e.name?.trim() || !e.description?.trim()) add(`evidence ${e.id} needs name and description`);
    if (!EVIDENCE_SPRITES.includes(e.sprite)) add(`evidence ${e.id} has unknown sprite "${e.sprite}"`);
    if (!(e.x >= 0.08 && e.x <= 0.92 && e.y >= 0.08 && e.y <= 0.92)) add(`evidence ${e.id} position must be between 0.08 and 0.92`);
  }

  // Walk the case in order: every question must be reachable with what the player can see.
  const visible = new Set<string>([...(c.suspects ?? []).map((s) => s.id), ...(c.evidence ?? []).filter((e) => !e.hidden).map((e) => e.id)]);
  const hidden = new Set((c.evidence ?? []).filter((e) => e.hidden).map((e) => e.id));
  const revealed = new Set<string>();
  if (!Array.isArray(c.questions) || c.questions.length < 3 || c.questions.length > 6) add('cases need 3–6 questions');
  for (const q of c.questions ?? []) {
    dup(q.id);
    if (!q.prompt?.trim()) add(`question ${q.id} has no prompt`);
    if (!Array.isArray(q.choices) || q.choices.length < 2 || q.choices.length > 4) add(`question ${q.id} needs 2–4 choices`);
    else if (!isIndex(q.answer, q.choices.length)) add(`question ${q.id} has an invalid answer index`);
    if (!q.feedback?.trim()) add(`question ${q.id} has no feedback`);
    if (q.category !== 'reading-detail' && q.category !== 'reading-inference') add(`question ${q.id} has an invalid category`);
    for (const r of q.requires ?? []) {
      if (!ids.has(r) && !visible.has(r)) add(`question ${q.id} requires unknown id "${r}"`);
      else if (!visible.has(r)) add(`question ${q.id} requires "${r}" before it is revealed`);
    }
    for (const r of q.reveals ?? []) {
      if (!hidden.has(r)) add(`question ${q.id} reveals "${r}", which is not hidden evidence`);
      if (revealed.has(r)) add(`evidence "${r}" is revealed twice`);
      revealed.add(r);
      visible.add(r);
    }
  }
  for (const h of hidden) if (!revealed.has(h)) add(`hidden evidence "${h}" is never revealed`);

  for (const [label, d] of [['solution', c.solution], ['proof', c.proof]] as const) {
    if (!d?.question?.trim()) add(`${label} has no question`);
    if (!Array.isArray(d?.choices) || d.choices.length < 2 || d.choices.length > 4) add(`${label} needs 2–4 choices`);
    else if (!isIndex(d.answer, d.choices.length)) add(`${label} has an invalid answer index`);
    if (!d?.explanation?.trim()) add(`${label} has no explanation`);
  }
  return out;
}

export interface BankSet {
  challenges: ContentBank<ChallengeItem>[];
  cases: ContentBank<DetectiveCase>[];
}

/** Validates every bank and checks ids are unique across all content. */
export function validateAll(banks: BankSet): ValidationIssue[] {
  const out: ValidationIssue[] = [];
  const seen = new Map<string, string>();
  const unique = (id: string, where: string) => {
    if (seen.has(id)) out.push({ id, message: `duplicate id (also in ${seen.get(id)})` });
    else seen.set(id, where);
  };
  for (const bank of banks.challenges) {
    const sentences = new Set<string>();
    for (const item of bank.items) {
      unique(item.id, `${bank.game}/${bank.level}`);
      out.push(...validateItem(item, bank));
      const text = signature(item);
      if (sentences.has(text)) out.push({ id: item.id, message: 'duplicate question (same text as another item)' });
      sentences.add(text);
    }
  }
  for (const bank of banks.cases) {
    for (const c of bank.items) {
      unique(c.id, `${bank.game}/${bank.level}`);
      out.push(...validateCase(c, bank.level));
    }
  }
  return out;
}

function signature(item: ChallengeItem) {
  switch (item.kind) {
    case 'choice': return `c:${norm(item.prompt)}`;
    case 'order': return `o:${item.chunks.map(norm).join(' ')}`;
    case 'category': return `k:${norm(item.prompt)}:${item.correct.map(norm).sort().join(',')}`;
    case 'spell': return `s:${item.word}`;
  }
}
