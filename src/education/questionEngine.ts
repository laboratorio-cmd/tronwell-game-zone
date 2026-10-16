import { CASE_BANKS, CHALLENGE_BANKS } from './content';
import type {
  CefrLevel, ChallengeItem, ChallengeKind, ChoiceItem, ContentBank, DetectiveCase, GameId, OrderItem,
} from './types';
import { validateCase, validateItem } from './validation/validate';

export class ContentError extends Error {
  constructor(message: string, readonly code: 'empty' | 'not-enough') {
    super(message);
    this.name = 'ContentError';
  }
}

export type Rng = () => number;

/** Small seeded generator so tests (and replays) are deterministic. */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(list: readonly T[], rng: Rng = Math.random): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const warned = new Set<string>();
function warnOnce(id: string, message: string) {
  if (warned.has(id)) return;
  warned.add(id);
  console.warn(`[content] ${id} skipped: ${message}`);
}

/** Valid items for a game and level. Invalid items are skipped (and reported), never served. */
export function getItems(
  game: GameId,
  level: CefrLevel,
  banks: ContentBank<ChallengeItem>[] = CHALLENGE_BANKS,
): ChallengeItem[] {
  const out: ChallengeItem[] = [];
  for (const bank of banks) {
    if (bank.game !== game || bank.level !== level) continue;
    for (const item of bank.items) {
      const issues = validateItem(item, bank);
      if (issues.length) warnOnce(item.id, issues[0].message);
      else out.push(item);
    }
  }
  return out;
}

export function getCases(level: CefrLevel, banks: ContentBank<DetectiveCase>[] = CASE_BANKS): DetectiveCase[] {
  const out: DetectiveCase[] = [];
  for (const bank of banks) {
    if (bank.level !== level) continue;
    for (const c of bank.items) {
      const issues = validateCase(c, bank.level);
      if (issues.length) warnOnce(c.id, issues[0].message);
      else out.push(c);
    }
  }
  return out;
}

/**
 * Picks `count` items, preferring ones the student has not practised recently.
 * Throws ContentError when the list is empty or holds fewer than `min` items.
 */
export function pickItems<T extends { id: string }>(
  items: readonly T[],
  count: number,
  opts: { recent?: readonly string[]; rng?: Rng; min?: number } = {},
): T[] {
  const { recent = [], rng = Math.random, min = 1 } = opts;
  if (items.length === 0) throw new ContentError('There are no missions for this level yet.', 'empty');
  if (items.length < min) throw new ContentError('There are not enough missions for this level yet.', 'not-enough');
  const recentSet = new Set(recent);
  const fresh = shuffle(items.filter((i) => !recentSet.has(i.id)), rng);
  // Older practice first: items seen longest ago come before the most recent ones.
  const seen = items.filter((i) => recentSet.has(i.id)).sort((a, b) => recent.indexOf(a.id) - recent.indexOf(b.id));
  return [...fresh, ...seen].slice(0, Math.min(count, items.length));
}

export function ofKind<K extends ChallengeKind>(items: readonly ChallengeItem[], kind: K) {
  return items.filter((i): i is Extract<ChallengeItem, { kind: K }> => i.kind === kind);
}

/* ---------- choice ---------- */

export interface PreparedChoice {
  item: ChoiceItem;
  /** Options in display order (shuffled). */
  options: string[];
  correctIndex: number;
}

export function prepareChoice(item: ChoiceItem, rng: Rng = Math.random): PreparedChoice {
  const order = shuffle(item.choices.map((_, i) => i), rng);
  return { item, options: order.map((i) => item.choices[i]), correctIndex: order.indexOf(item.answer) };
}

export function checkChoice(p: PreparedChoice, chosen: number): boolean {
  return chosen === p.correctIndex;
}

export function correctChoice(item: ChoiceItem): string {
  return item.choices[item.answer];
}

/** The sentence with the gap filled in. */
export function filledSentence(item: ChoiceItem, option = correctChoice(item)): string {
  return item.prompt.replace('___', option);
}

/* ---------- order ---------- */

const normChunk = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

export function orderSentence(item: OrderItem, chunks: readonly string[] = item.chunks): string {
  return chunks.join(' ') + item.punctuation;
}

/** True when the attempt matches the main order or a listed alternative. */
export function checkOrder(item: OrderItem, attempt: readonly string[]): boolean {
  const a = attempt.map(normChunk).join(' ');
  return [item.chunks, ...(item.alternatives ?? [])].some((ok) => ok.map(normChunk).join(' ') === a);
}

/** Shuffled chunks that are never already in a correct order. */
export function scrambleChunks(item: OrderItem, rng: Rng = Math.random): string[] {
  for (let tries = 0; tries < 20; tries++) {
    const s = shuffle(item.chunks, rng);
    if (!checkOrder(item, s)) return s;
  }
  return [...item.chunks].reverse();
}
