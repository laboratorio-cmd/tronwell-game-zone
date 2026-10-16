import type { CefrLevel, GameId, SkillCategory } from '../../education/types';

/** One answered challenge (first attempt only). */
export interface AnswerRecord {
  itemId: string;
  correct: boolean;
  category: SkillCategory;
  /** What the student saw, e.g. "She ___ to school every day." */
  prompt: string;
  given?: string;
  /** The correct answer or sentence. */
  expected: string;
  feedback: string;
}

/** What every game hands back when it ends. */
export interface GameResult {
  gameId: GameId;
  level: CefrLevel;
  status: 'completed' | 'quit';
  score: number;
  correct: number;
  incorrect: number;
  bestCombo: number;
  /** Number of challenges finished (questions, missions, gates, case steps). */
  challenges: number;
  answers: AnswerRecord[];
  /** Game-specific facts, e.g. { position: 1 } or { solved: true }. */
  meta?: Record<string, string | number | boolean>;
}

export interface SessionRecord {
  sessionId: string;
  studentId: string;
  gameId: GameId;
  level: CefrLevel;
  startedAt: string;
  completedAt: string;
  status: 'completed' | 'quit';
  score: number;
  correct: number;
  incorrect: number;
  /** 0–1, first attempts only. */
  accuracy: number;
  challenges: number;
  bestCombo: number;
  contentIds: string[];
  /** Category -> number of mistakes. */
  errorCategories: Partial<Record<SkillCategory, number>>;
  xp: number;
  coins: number;
  meta?: Record<string, string | number | boolean>;
}

export interface ProfileData {
  version: 1;
  /** Anonymous id for this device's player. No names or personal data. */
  studentId: string;
  createdAt: string;
  xp: number;
  coins: number;
  sessions: SessionRecord[];
  /** "<gameId>|<level>" -> best score */
  best: Record<string, number>;
  /** achievement id -> ISO date unlocked */
  achievements: Record<string, string>;
  processedSessionIds: string[];
  /** gameId -> content ids, oldest first */
  recentContent: Partial<Record<GameId, string[]>>;
}

export type StorageMode = 'local' | 'memory' | 'remote';

export interface SaveOutcome {
  ok: boolean;
  mode: StorageMode;
  error?: string;
}
