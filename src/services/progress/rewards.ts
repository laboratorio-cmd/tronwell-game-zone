import { accuracyOf } from './scoring';

/**
 * XP and coin rules (documented in README):
 * - XP: 10 per correct answer; +20 for finishing a game; +10 for 80%+ accuracy or +20 for 100%
 *   (accuracy bonuses need at least 5 answers and a finished game).
 * - Coins: 2 per correct answer; +5 for finishing; +5 for a perfect game.
 * - Quitting keeps the XP/coins of correct answers only.
 */
export const REWARDS = {
  xpPerCorrect: 10,
  xpFinish: 20,
  xpAccuracy: [
    { min: 1, xp: 20, label: 'Perfect accuracy' },
    { min: 0.8, xp: 10, label: 'Great accuracy' },
  ],
  minAnswersForAccuracyBonus: 5,
  coinsPerCorrect: 2,
  coinsFinish: 5,
  coinsPerfect: 5,
};

export interface RewardLine {
  label: string;
  xp: number;
  coins: number;
}

export interface Rewards {
  xp: number;
  coins: number;
  lines: RewardLine[];
}

export function computeRewards(r: { correct: number; incorrect: number; status: 'completed' | 'quit' }): Rewards {
  const lines: RewardLine[] = [];
  if (r.correct > 0) {
    lines.push({ label: `${r.correct} correct answer${r.correct === 1 ? '' : 's'}`, xp: r.correct * REWARDS.xpPerCorrect, coins: r.correct * REWARDS.coinsPerCorrect });
  }
  if (r.status === 'completed') {
    lines.push({ label: 'Mission complete', xp: REWARDS.xpFinish, coins: REWARDS.coinsFinish });
    const total = r.correct + r.incorrect;
    const acc = accuracyOf(r.correct, r.incorrect);
    if (total >= REWARDS.minAnswersForAccuracyBonus) {
      const tier = REWARDS.xpAccuracy.find((t) => acc >= t.min);
      if (tier) lines.push({ label: tier.label, xp: tier.xp, coins: acc >= 1 ? REWARDS.coinsPerfect : 0 });
    }
  }
  return {
    xp: lines.reduce((s, l) => s + l.xp, 0),
    coins: lines.reduce((s, l) => s + l.coins, 0),
    lines,
  };
}

export const RANKS = [
  { xp: 0, name: 'Space Cadet' },
  { xp: 200, name: 'Star Pilot' },
  { xp: 600, name: 'Navigator' },
  { xp: 1500, name: 'Commander' },
  { xp: 3000, name: 'Star Captain' },
  { xp: 6000, name: 'Galaxy Legend' },
];

export function rankFor(xp: number) {
  let i = 0;
  while (i + 1 < RANKS.length && xp >= RANKS[i + 1].xp) i++;
  const cur = RANKS[i];
  const next = RANKS[i + 1];
  return {
    name: cur.name,
    index: i,
    next: next?.name ?? null,
    /** 0–1 progress to the next rank (1 at the top rank). */
    progress: next ? (xp - cur.xp) / (next.xp - cur.xp) : 1,
    toNext: next ? next.xp - xp : 0,
  };
}
