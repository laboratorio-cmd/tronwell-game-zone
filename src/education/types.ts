/**
 * Educational content model shared by every game.
 * Content lives in src/education/content and never contains rendering logic.
 */

export const CEFR_LEVELS = ['A0', 'A1', 'A2', 'B1', 'B2'] as const;
export type CefrLevel = (typeof CEFR_LEVELS)[number];

export const GAME_IDS = ['grammar-blaster', 'word-jumper', 'tense-racer', 'english-detective'] as const;
export type GameId = (typeof GAME_IDS)[number];

/** draft = sample content written for the MVP; reviewed = checked by a Tronwell teacher. */
export type ContentStatus = 'draft' | 'reviewed';

/** Skill areas. The label is what students see in "Areas to practise". */
export const SKILL_CATEGORIES = {
  'be': 'The verb "be"',
  'have-got': 'have / have got',
  'present-simple': 'Present simple',
  'present-continuous': 'Present continuous',
  'past-simple': 'Past simple',
  'past-continuous': 'Past continuous',
  'present-perfect': 'Present perfect',
  'past-perfect': 'Past perfect',
  'future-forms': 'Future forms (will / going to)',
  'tense-contrast': 'Choosing the right tense',
  'auxiliaries': 'Auxiliary verbs (do, does, did…)',
  'questions': 'Making questions',
  'negatives': 'Negative sentences',
  'modals': 'Modal verbs (can, must, should…)',
  'conditionals': 'Conditionals (if…)',
  'passive': 'Passive voice',
  'reported-speech': 'Reported speech',
  'relative-clauses': 'Relative clauses (who, which…)',
  'gerunds-infinitives': 'Verb + -ing / to + verb',
  'comparatives': 'Comparatives and superlatives',
  'articles-quantifiers': 'a, an, the, some, any, much, many',
  'plurals': 'Plurals',
  'pronouns-possessives': 'Pronouns and possessives',
  'prepositions': 'Prepositions',
  'there-is-are': 'there is / there are',
  'connectors': 'Linking words',
  'word-order': 'Word order',
  'vocabulary': 'Vocabulary',
  'spelling': 'Spelling',
  'word-categories': 'Word groups',
  'reading-detail': 'Reading for detail',
  'reading-inference': 'Reading between the lines',
} as const;
export type SkillCategory = keyof typeof SKILL_CATEGORIES;

/** Pixel icons available for picture clues (see src/games/shared/pixel/icons.ts). */
export const ICON_KEYS = [
  'cat', 'dog', 'fish', 'bird', 'rabbit', 'apple', 'banana', 'cake', 'egg', 'pizza',
  'sun', 'moon', 'star', 'cloud', 'tree', 'flower', 'rocket', 'planet', 'house', 'car',
  'bus', 'ball', 'book', 'pen', 'bag', 'hat', 'clock', 'phone', 'key', 'chair', 'cup', 'shoe',
] as const;
export type IconKey = (typeof ICON_KEYS)[number];

interface ItemBase {
  /** Unique id: <game code>-<level>-<number>, e.g. "gb-a1-014". Codes: gb, wj, tr, ed. */
  id: string;
  level: CefrLevel;
  games: GameId[];
  /** Short learning objective, e.g. "Present simple: he/she/it + -s". */
  objective: string;
  category: SkillCategory;
  /** Difficulty inside the level: 1 easy, 2 medium, 3 hard. */
  difficulty: 1 | 2 | 3;
  /** Explains WHY the answer is right. Shown after every answer. */
  feedback: string;
  hint?: string;
  tags: string[];
  /** image: "icon:<IconKey>" for a built-in pixel icon, or a path to a bundled image. */
  asset?: { image?: string; audio?: string };
  status: ContentStatus;
}

/** Gap-fill with options. Used by Grammar Blaster and Tense Racer. */
export interface ChoiceItem extends ItemBase {
  kind: 'choice';
  /** Sentence with exactly one gap written as ___ */
  prompt: string;
  /** 2–4 options; each one must fit on an asteroid / gate (max 24 characters). */
  choices: string[];
  /** Index of the correct option in `choices`. */
  answer: number;
}

/** Put the chunks in order. Used by Tense Racer. */
export interface OrderItem extends ItemBase {
  kind: 'order';
  /** Optional instruction, e.g. "Make a question." */
  prompt?: string;
  /** The sentence split into chunks, in the CORRECT order, without final punctuation. */
  chunks: string[];
  punctuation: '.' | '?' | '!';
  /** Other completely correct orders (each a permutation of `chunks`). */
  alternatives?: string[][];
}

/** Collect the words that belong to a group. Used by Word Jumper. */
export interface CategoryItem extends ItemBase {
  kind: 'category';
  /** Mission text, e.g. "Find the animals". */
  prompt: string;
  /** 3–5 words that belong. */
  correct: string[];
  /** 3–5 words that do not belong. */
  distractors: string[];
  /** Optional pixel icon per word (word -> icon key). */
  icons?: Record<string, IconKey>;
}

/** Spell the word that matches the clue by collecting letters. Used by Word Jumper. */
export interface SpellItem extends ItemBase {
  kind: 'spell';
  /** Definition or picture caption. Must not contain the word itself. */
  clue: string;
  /** Lowercase letters only, 3–10 letters. */
  word: string;
  /** 2–4 extra letters that are NOT in the word (plausible mistakes). */
  decoys: string;
}

export type ChallengeItem = ChoiceItem | OrderItem | CategoryItem | SpellItem;
export type ChallengeKind = ChallengeItem['kind'];

/* ---------- English Detective ---------- */

export const CASE_SCENES = ['lab', 'cafe', 'hangar', 'garden', 'library', 'quarters'] as const;
export type CaseScene = (typeof CASE_SCENES)[number];

/** Suspect portraits. The first seven use the PNG asset pack; the rest are older pixel-art looks. */
export const CHARACTER_LOOKS = [
  'boy-glasses', 'man-beard', 'officer', 'girl-ginger', 'girl-dark', 'robot', 'alien',
  'student-a', 'student-b', 'teen-a', 'teen-b', 'engineer', 'scientist', 'chef', 'captain', 'medic', 'gardener',
] as const;
export type CharacterLook = (typeof CHARACTER_LOOKS)[number];

export const EVIDENCE_SPRITES = [
  'note', 'keycard', 'footprints', 'cup', 'tablet', 'box', 'plant', 'toolbox', 'map', 'photo',
  'bag', 'glove', 'key', 'crumbs', 'paint', 'ticket', 'book', 'watch', 'bottle', 'torch',
] as const;
export type EvidenceSprite = (typeof EVIDENCE_SPRITES)[number];

export interface Suspect {
  id: string;
  name: string;
  /** e.g. "the station chef" */
  role: string;
  look: CharacterLook;
  /** What the suspect says when the player talks to them (1–3 short sentences). */
  statement: string;
}

export interface Evidence {
  id: string;
  name: string;
  sprite: EvidenceSprite;
  /** What the player reads when examining it (1–2 short sentences). */
  description: string;
  /** Hidden evidence appears only after a question reveals it. */
  hidden?: boolean;
  /** Position in the room, 0–1 from the left / top (kept between 0.08 and 0.92). */
  x: number;
  y: number;
}

export interface CaseQuestion {
  id: string;
  prompt: string;
  choices: string[];
  answer: number;
  /** Explains the answer and points to the text that proves it. */
  feedback: string;
  /** Ids of suspects/evidence the player must examine before this question opens. */
  requires: string[];
  /** Ids of hidden evidence revealed when this question is answered. */
  reveals?: string[];
  category: 'reading-detail' | 'reading-inference';
}

export interface CaseDecision {
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
}

export interface DetectiveCase {
  /** ed-<level>-<number>, e.g. "ed-a2-01" */
  id: string;
  level: CefrLevel;
  games: ['english-detective'];
  objective: string;
  difficulty: 1 | 2 | 3;
  status: ContentStatus;
  tags: string[];
  title: string;
  scene: CaseScene;
  /** 2–4 short lines that set up the mystery. */
  briefing: string[];
  suspects: Suspect[];
  evidence: Evidence[];
  /** 3–6 comprehension questions, in order. */
  questions: CaseQuestion[];
  /** Final accusation: what happened / who did it. */
  solution: CaseDecision;
  /** Which clue proves the solution. */
  proof: CaseDecision;
}

/** A bank file: every item in it must belong to `level` and `game`. */
export interface ContentBank<T> {
  game: GameId;
  level: CefrLevel;
  items: T[];
}
