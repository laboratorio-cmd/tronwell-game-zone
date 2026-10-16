import { GAME_IDS } from '../../education/types';
import type { ProfileData, SessionRecord } from './types';

export interface AchievementContext {
  /** Profile AFTER the new session was added. */
  profile: ProfileData;
  record: SessionRecord;
  /** Best score for this game and level before this session (0 if none). */
  previousBest: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  /** Pixel badge colour. */
  color: string;
  check: (ctx: AchievementContext) => boolean;
}

/** Calendar days (local time) with at least one finished game. */
export function practiceDays(sessions: SessionRecord[]): string[] {
  const days = new Set(sessions.filter((s) => s.status === 'completed').map((s) => localDay(s.completedAt)));
  return [...days].sort();
}

export function localDay(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Longest run of consecutive practice days ending on the most recent one. */
export function currentStreak(sessions: SessionRecord[]): number {
  const days = practiceDays(sessions);
  if (!days.length) return 0;
  let streak = 1;
  for (let i = days.length - 1; i > 0; i--) {
    const a = new Date(days[i] + 'T12:00:00');
    const b = new Date(days[i - 1] + 'T12:00:00');
    if (Math.round((a.getTime() - b.getTime()) / 86400000) === 1) streak++;
    else break;
  }
  return streak;
}

const completed = (p: ProfileData) => p.sessions.filter((s) => s.status === 'completed');

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-mission',
    title: 'First Mission',
    description: 'Finish your first game.',
    color: '#39D9FF',
    check: ({ profile }) => completed(profile).length >= 1,
  },
  {
    id: 'space-explorer',
    title: 'Space Explorer',
    description: 'Finish all four games.',
    color: '#7957FF',
    check: ({ profile }) => GAME_IDS.every((g) => completed(profile).some((s) => s.gameId === g)),
  },
  {
    id: 'accuracy-ace',
    title: 'Accuracy Ace',
    description: 'Finish a game with 90% accuracy or more (at least 8 answers).',
    color: '#FFD166',
    check: ({ record }) => record.status === 'completed' && record.correct + record.incorrect >= 8 && record.accuracy >= 0.9,
  },
  {
    id: 'personal-best',
    title: 'Personal Best',
    description: 'Beat your own high score in a game.',
    color: '#FF9F43',
    check: ({ record, previousBest }) => record.status === 'completed' && previousBest > 0 && record.score > previousBest,
  },
  {
    id: 'combo-master',
    title: 'Combo Master',
    description: 'Get 8 answers right in a row.',
    color: '#B36BFF',
    check: ({ record }) => record.bestCombo >= 8,
  },
  {
    id: 'case-closed',
    title: 'Case Closed',
    description: 'Solve a mystery in English Detective.',
    color: '#3DDC84',
    check: ({ record }) => record.gameId === 'english-detective' && record.status === 'completed' && record.meta?.solved === true,
  },
  {
    id: 'practice-streak',
    title: 'Practice Streak',
    description: 'Play on 3 days in a row.',
    color: '#FF5468',
    check: ({ profile }) => currentStreak(profile.sessions) >= 3,
  },
  {
    id: 'rising-star',
    title: 'Rising Star',
    description: 'Earn 1,000 XP.',
    color: '#F5F7FF',
    check: ({ profile }) => profile.xp >= 1000,
  },
];

/** Achievements unlocked by this session (never ones already owned). */
export function newAchievements(ctx: AchievementContext): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !ctx.profile.achievements[a.id] && a.check(ctx));
}
