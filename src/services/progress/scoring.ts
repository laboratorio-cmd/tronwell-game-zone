import type { SkillCategory } from '../../education/types';
import type { AnswerRecord } from './types';

/**
 * Shared scoring rules (documented in README):
 * - correct answer: (100 + difficulty bonus) × combo multiplier
 * - difficulty bonus: easy 0, medium 25, hard 50
 * - combo multiplier: 1–2 in a row ×1, 3–5 ×2, 6–9 ×3, 10+ ×4
 * - wrong answer: 0 points and the combo resets (never negative points)
 * - gameplay bonuses (rings, coins, race position…) are capped per session
 */
export const SCORING = {
  basePoints: 100,
  difficultyBonus: { 1: 0, 2: 25, 3: 50 } as Record<1 | 2 | 3, number>,
  comboSteps: [
    { from: 10, multiplier: 4 },
    { from: 6, multiplier: 3 },
    { from: 3, multiplier: 2 },
    { from: 0, multiplier: 1 },
  ],
  maxBonusPerSession: 3000,
};

export function comboMultiplier(combo: number): number {
  return SCORING.comboSteps.find((s) => combo >= s.from)?.multiplier ?? 1;
}

/** Highest score a session can reach with n answers (used to reject impossible results). */
export function maxPossibleScore(answers: number): number {
  return answers * (SCORING.basePoints + SCORING.difficultyBonus[3]) * 4 + SCORING.maxBonusPerSession;
}

export interface AnswerInput {
  itemId: string;
  correct: boolean;
  category: SkillCategory;
  difficulty: 1 | 2 | 3;
  prompt: string;
  given?: string;
  expected: string;
  feedback: string;
}

export interface AnswerOutcome {
  points: number;
  combo: number;
  multiplier: number;
  /** true if this item was already answered: nothing changes. */
  duplicate: boolean;
}

/** Keeps score, combo and the answer log for one session. Shared by all four games. */
export class ScoreKeeper {
  score = 0;
  combo = 0;
  bestCombo = 0;
  correct = 0;
  incorrect = 0;
  bonus = 0;
  readonly answers: AnswerRecord[] = [];
  private answered = new Set<string>();

  /** Records the FIRST attempt at an item. Later attempts at the same item score nothing. */
  answer(input: AnswerInput): AnswerOutcome {
    if (this.answered.has(input.itemId)) {
      return { points: 0, combo: this.combo, multiplier: comboMultiplier(this.combo), duplicate: true };
    }
    this.answered.add(input.itemId);
    const { difficulty, ...rec } = input;
    this.answers.push(rec);
    if (!input.correct) {
      this.incorrect++;
      this.combo = 0;
      return { points: 0, combo: 0, multiplier: 1, duplicate: false };
    }
    this.correct++;
    this.combo++;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    const multiplier = comboMultiplier(this.combo);
    const points = (SCORING.basePoints + SCORING.difficultyBonus[difficulty]) * multiplier;
    this.score += points;
    return { points, combo: this.combo, multiplier, duplicate: false };
  }

  /** Gameplay bonus points; returns what was actually added after the session cap. */
  addBonus(points: number): number {
    const room = Math.max(0, SCORING.maxBonusPerSession - this.bonus);
    const add = Math.max(0, Math.min(Math.round(points), room));
    this.bonus += add;
    this.score += add;
    return add;
  }

  hasAnswered(itemId: string) {
    return this.answered.has(itemId);
  }

  get accuracy(): number {
    return accuracyOf(this.correct, this.incorrect);
  }
}

export function accuracyOf(correct: number, incorrect: number): number {
  const total = correct + incorrect;
  return total === 0 ? 0 : correct / total;
}
