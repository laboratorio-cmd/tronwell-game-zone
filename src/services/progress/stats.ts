import { GAME_IDS, SKILL_CATEGORIES, type CefrLevel, type GameId, type SkillCategory } from '../../education/types';
import { ACHIEVEMENTS, currentStreak } from './achievements';
import { rankFor } from './rewards';
import { accuracyOf } from './scoring';
import type { ProfileData, SessionRecord } from './types';

export interface GameStats {
  gameId: GameId;
  played: number;
  completed: number;
  bestScore: number;
  bestLevel: CefrLevel | null;
  /** 0–1 over all answers in this game, or null if never played. */
  accuracy: number | null;
}

export interface PractiseArea {
  category: SkillCategory;
  label: string;
  mistakes: number;
}

export interface ProgressSummary {
  xp: number;
  coins: number;
  rank: ReturnType<typeof rankFor>;
  gamesPlayed: number;
  gamesCompleted: number;
  streak: number;
  recent: SessionRecord[];
  byGame: GameStats[];
  practise: PractiseArea[];
  achievements: { id: string; title: string; description: string; color: string; unlockedAt: string | null }[];
}

/** How many recent sessions count for "areas to practise". */
const PRACTISE_WINDOW = 20;

export function summarize(profile: ProfileData): ProgressSummary {
  const sessions = profile.sessions;
  const byGame = GAME_IDS.map((gameId): GameStats => {
    const mine = sessions.filter((s) => s.gameId === gameId);
    const correct = mine.reduce((n, s) => n + s.correct, 0);
    const incorrect = mine.reduce((n, s) => n + s.incorrect, 0);
    let bestScore = 0;
    let bestLevel: CefrLevel | null = null;
    for (const [key, score] of Object.entries(profile.best)) {
      const [g, lv] = key.split('|');
      if (g === gameId && score > bestScore) {
        bestScore = score;
        bestLevel = lv as CefrLevel;
      }
    }
    return {
      gameId,
      played: mine.length,
      completed: mine.filter((s) => s.status === 'completed').length,
      bestScore,
      bestLevel,
      accuracy: correct + incorrect ? accuracyOf(correct, incorrect) : null,
    };
  });

  const counts = new Map<SkillCategory, number>();
  for (const s of sessions.slice(-PRACTISE_WINDOW)) {
    for (const [cat, n] of Object.entries(s.errorCategories) as [SkillCategory, number][]) {
      counts.set(cat, (counts.get(cat) ?? 0) + n);
    }
  }
  const practise = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([category, mistakes]) => ({ category, label: SKILL_CATEGORIES[category], mistakes }));

  return {
    xp: profile.xp,
    coins: profile.coins,
    rank: rankFor(profile.xp),
    gamesPlayed: sessions.length,
    gamesCompleted: sessions.filter((s) => s.status === 'completed').length,
    streak: currentStreak(sessions),
    recent: [...sessions].reverse().slice(0, 8),
    byGame,
    practise,
    achievements: ACHIEVEMENTS.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      color: a.color,
      unlockedAt: profile.achievements[a.id] ?? null,
    })),
  };
}
