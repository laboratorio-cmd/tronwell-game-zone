import { describe, expect, it } from 'vitest';
import { MemoryStore } from '../storage';
import { currentStreak } from './achievements';
import { DeviceProgressRepository, PROFILE_KEY } from './repository';
import { ProgressService, validateResult } from './progressService';
import { computeRewards, rankFor } from './rewards';
import { comboMultiplier, ScoreKeeper } from './scoring';
import { summarize } from './stats';
import type { AnswerRecord, GameResult, SessionRecord } from './types';

const ans = (i: number, correct: boolean): AnswerRecord => ({
  itemId: `gb-a1-${String(i).padStart(3, '0')}`,
  correct,
  category: 'present-simple',
  prompt: 'Kai ___ football.',
  expected: 'plays',
  feedback: 'He/she/it + -s.',
});

function result(correct: number, incorrect: number, extra: Partial<GameResult> = {}): GameResult {
  const answers = [...Array(correct)].map((_, i) => ans(i, true)).concat([...Array(incorrect)].map((_, i) => ans(100 + i, false)));
  return { gameId: 'grammar-blaster', level: 'A1', status: 'completed', score: correct * 100, correct, incorrect, bestCombo: correct ? 1 : 0, challenges: answers.length, answers, ...extra };
}

function service(store = new MemoryStore(), clock = () => new Date('2026-10-16T15:00:00Z')) {
  return new ProgressService(new DeviceProgressRepository(store, true), clock);
}

describe('ScoreKeeper', () => {
  it('scores correct answers with difficulty and combo multipliers', () => {
    const k = new ScoreKeeper();
    const base = { category: 'be' as const, prompt: 'p', expected: 'e', feedback: 'f' };
    expect(k.answer({ ...base, itemId: 'a', correct: true, difficulty: 1 }).points).toBe(100);
    expect(k.answer({ ...base, itemId: 'b', correct: true, difficulty: 2 }).points).toBe(125);
    const third = k.answer({ ...base, itemId: 'c', correct: true, difficulty: 3 });
    expect(third.multiplier).toBe(2);
    expect(third.points).toBe(300);
    expect(k.score).toBe(525);
    expect(k.bestCombo).toBe(3);
  });

  it('resets the combo on a wrong answer and never subtracts points', () => {
    const k = new ScoreKeeper();
    const base = { category: 'be' as const, prompt: 'p', expected: 'e', feedback: 'f', difficulty: 1 as const };
    k.answer({ ...base, itemId: 'a', correct: true });
    const wrong = k.answer({ ...base, itemId: 'b', correct: false });
    expect(wrong.points).toBe(0);
    expect(k.combo).toBe(0);
    expect(k.score).toBe(100);
    expect(k.accuracy).toBe(0.5);
  });

  it('counts only the first attempt at an item', () => {
    const k = new ScoreKeeper();
    const base = { category: 'be' as const, prompt: 'p', expected: 'e', feedback: 'f', difficulty: 1 as const };
    k.answer({ ...base, itemId: 'a', correct: false });
    const retry = k.answer({ ...base, itemId: 'a', correct: true });
    expect(retry.duplicate).toBe(true);
    expect(k.correct).toBe(0);
    expect(k.answers).toHaveLength(1);
  });

  it('caps gameplay bonuses', () => {
    const k = new ScoreKeeper();
    expect(k.addBonus(2500)).toBe(2500);
    expect(k.addBonus(2500)).toBe(500);
    expect(k.addBonus(10)).toBe(0);
  });

  it('uses documented combo steps', () => {
    expect([1, 2, 3, 5, 6, 9, 10, 20].map(comboMultiplier)).toEqual([1, 1, 2, 2, 3, 3, 4, 4]);
  });
});

describe('rewards', () => {
  it('awards XP for correct answers, finishing and accuracy', () => {
    expect(computeRewards({ correct: 10, incorrect: 0, status: 'completed' })).toMatchObject({ xp: 100 + 20 + 20, coins: 20 + 5 + 5 });
    expect(computeRewards({ correct: 8, incorrect: 2, status: 'completed' })).toMatchObject({ xp: 80 + 20 + 10, coins: 16 + 5 });
    expect(computeRewards({ correct: 5, incorrect: 5, status: 'completed' })).toMatchObject({ xp: 50 + 20, coins: 10 + 5 });
  });

  it('gives no finishing or accuracy bonus when the player quits', () => {
    expect(computeRewards({ correct: 3, incorrect: 0, status: 'quit' })).toMatchObject({ xp: 30, coins: 6 });
  });

  it('computes ranks', () => {
    expect(rankFor(0).name).toBe('Space Cadet');
    expect(rankFor(250).name).toBe('Star Pilot');
    expect(rankFor(400).progress).toBeCloseTo(0.5);
    expect(rankFor(99999).next).toBeNull();
  });
});

describe('ProgressService', () => {
  it('records a session, awards XP once and persists it', async () => {
    const store = new MemoryStore();
    const svc = service(store);
    await svc.init();
    const s = svc.startSession('grammar-blaster', 'A1', ['gb-a1-000']);
    const out = await svc.completeSession(s, result(8, 2));
    expect(out.duplicate).toBe(false);
    expect(out.record.accuracy).toBeCloseTo(0.8);
    expect(out.record.errorCategories).toEqual({ 'present-simple': 2 });
    expect(out.saved).toEqual({ ok: true, mode: 'local', error: undefined });
    expect(svc.current().xp).toBe(out.rewards.xp);
    expect(out.achievements.map((a) => a.id)).toContain('first-mission');
    expect(JSON.parse(store.getItem(PROFILE_KEY) as string).sessions).toHaveLength(1);
  });

  it('does not award rewards twice for the same session', async () => {
    const svc = service();
    await svc.init();
    const s = svc.startSession('grammar-blaster', 'A1', []);
    const [a, b] = await Promise.all([svc.completeSession(s, result(5, 0)), svc.completeSession(s, result(5, 0))]);
    expect(a.duplicate).toBe(false);
    expect(b.duplicate).toBe(true);
    const again = await svc.completeSession(s, result(5, 0));
    expect(again.duplicate).toBe(true);
    expect(again.rewards).toEqual(a.rewards);
    expect(svc.current().sessions).toHaveLength(1);
    expect(svc.current().xp).toBe(a.rewards.xp);
  });

  it('reloads saved progress in a new service (same device)', async () => {
    const store = new MemoryStore();
    const first = service(store);
    await first.init();
    await first.completeSession(first.startSession('tense-racer', 'B1', []), { ...result(3, 1), gameId: 'tense-racer', level: 'B1' });
    const second = service(store);
    const profile = await second.init();
    expect(profile.sessions).toHaveLength(1);
    expect(profile.best['tense-racer|B1']).toBe(300);
  });

  it('detects a personal best only when an earlier score is beaten', async () => {
    const svc = service();
    await svc.init();
    const one = await svc.completeSession(svc.startSession('grammar-blaster', 'A1', []), result(3, 0));
    expect(one.personalBest).toBe(true);
    expect(one.achievements.map((a) => a.id)).not.toContain('personal-best');
    const two = await svc.completeSession(svc.startSession('grammar-blaster', 'A1', []), result(4, 0));
    expect(two.previousBest).toBe(300);
    expect(two.achievements.map((a) => a.id)).toContain('personal-best');
    const three = await svc.completeSession(svc.startSession('grammar-blaster', 'A1', []), result(1, 0));
    expect(three.personalBest).toBe(false);
  });

  it('rejects impossible results', async () => {
    const svc = service();
    await svc.init();
    const s = svc.startSession('grammar-blaster', 'A1', []);
    await expect(svc.completeSession(s, { ...result(2, 0), correct: 5 })).rejects.toThrow(/Invalid game result/);
    expect(validateResult({ ...result(2, 0), score: 10_000_000 }, s)).toContain('score is higher than possible');
    expect(validateResult({ ...result(2, 0), gameId: 'word-jumper' }, s)).toContain('result is for a different game');
    expect(svc.current().xp).toBe(0);
  });

  it('reports when storage is not persistent', async () => {
    const svc = new ProgressService(new DeviceProgressRepository(new MemoryStore(), false));
    await svc.init();
    const out = await svc.completeSession(svc.startSession('grammar-blaster', 'A1', []), result(1, 0));
    expect(out.saved.ok).toBe(false);
    expect(out.saved.mode).toBe('memory');
  });

  it('remembers practised content, oldest first', async () => {
    const svc = service();
    await svc.init();
    await svc.completeSession(svc.startSession('grammar-blaster', 'A1', ['x', 'y']), result(1, 0));
    await svc.completeSession(svc.startSession('grammar-blaster', 'A1', ['y', 'z']), result(1, 0));
    expect(svc.recentContent('grammar-blaster')).toEqual(['x', 'y', 'z']);
  });
});

describe('streaks and summary', () => {
  const rec = (day: string, extra: Partial<SessionRecord> = {}): SessionRecord => ({
    sessionId: day, studentId: 's', gameId: 'grammar-blaster', level: 'A1', startedAt: `${day}T12:00:00`, completedAt: `${day}T12:05:00`,
    status: 'completed', score: 100, correct: 1, incorrect: 1, accuracy: 0.5, challenges: 2, bestCombo: 1, contentIds: [],
    errorCategories: { 'past-simple': 1 }, xp: 10, coins: 2, ...extra,
  });

  it('counts consecutive practice days', () => {
    expect(currentStreak([rec('2026-10-14'), rec('2026-10-15'), rec('2026-10-16')])).toBe(3);
    expect(currentStreak([rec('2026-10-12'), rec('2026-10-15'), rec('2026-10-16')])).toBe(2);
    expect(currentStreak([])).toBe(0);
  });

  it('summarises accuracy by game and areas to practise', () => {
    const profile = {
      version: 1 as const, studentId: 's', createdAt: '', xp: 30, coins: 6, best: { 'grammar-blaster|A1': 100 }, achievements: {},
      processedSessionIds: [], recentContent: {},
      sessions: [rec('2026-10-15'), rec('2026-10-16', { errorCategories: { 'past-simple': 2, 'questions': 1 } })],
    };
    const s = summarize(profile);
    const gb = s.byGame.find((g) => g.gameId === 'grammar-blaster');
    expect(gb).toMatchObject({ played: 2, bestScore: 100, bestLevel: 'A1', accuracy: 0.5 });
    expect(s.byGame.find((g) => g.gameId === 'word-jumper')?.accuracy).toBeNull();
    expect(s.practise[0]).toMatchObject({ category: 'past-simple', mistakes: 3 });
    expect(s.recent[0].sessionId).toBe('2026-10-16');
  });
});
