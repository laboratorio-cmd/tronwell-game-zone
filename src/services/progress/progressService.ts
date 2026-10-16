import { CEFR_LEVELS, GAME_IDS, SKILL_CATEGORIES, type CefrLevel, type GameId, type SkillCategory } from '../../education/types';
import { makeId } from '../storage';
import { newAchievements, type Achievement } from './achievements';
import type { ProgressRepository } from './repository';
import { computeRewards, type Rewards } from './rewards';
import { accuracyOf, maxPossibleScore } from './scoring';
import type { GameResult, ProfileData, SaveOutcome, SessionRecord } from './types';

export interface ActiveSession {
  sessionId: string;
  gameId: GameId;
  level: CefrLevel;
  startedAt: string;
  contentIds: string[];
}

export interface CompletionOutcome {
  record: SessionRecord;
  rewards: Rewards;
  achievements: Achievement[];
  personalBest: boolean;
  previousBest: number;
  saved: SaveOutcome;
  /** The same session was submitted before: nothing was awarded again. */
  duplicate: boolean;
}

const RECENT_PER_GAME = 60;

/** Checks a game's result before anything is awarded. Returns a list of problems. */
export function validateResult(r: GameResult, session: ActiveSession): string[] {
  const p: string[] = [];
  if (!GAME_IDS.includes(r.gameId)) p.push('unknown game');
  if (r.gameId !== session.gameId) p.push('result is for a different game');
  if (!CEFR_LEVELS.includes(r.level) || r.level !== session.level) p.push('level mismatch');
  if (r.status !== 'completed' && r.status !== 'quit') p.push('invalid status');
  const nums = [r.score, r.correct, r.incorrect, r.bestCombo, r.challenges];
  if (nums.some((n) => !Number.isFinite(n) || n < 0 || Math.floor(n) !== n)) p.push('counts must be whole numbers ≥ 0');
  if (!Array.isArray(r.answers)) p.push('answers missing');
  else {
    if (r.correct + r.incorrect !== r.answers.length) p.push('correct + incorrect must equal the number of answers');
    if (r.answers.filter((a) => a.correct).length !== r.correct) p.push('correct count does not match the answers');
    if (new Set(r.answers.map((a) => a.itemId)).size !== r.answers.length) p.push('an item was answered twice');
    if (r.answers.some((a) => !(a.category in SKILL_CATEGORIES))) p.push('unknown skill category');
  }
  if (r.bestCombo > r.correct) p.push('combo cannot exceed correct answers');
  if (r.score > maxPossibleScore(r.answers?.length ?? 0)) p.push('score is higher than possible');
  return p;
}

type Listener = (profile: ProfileData) => void;

/** Starts and finishes sessions, awards XP/coins/achievements once, and keeps the profile. */
export class ProgressService {
  private profile: ProfileData | null = null;
  private listeners = new Set<Listener>();
  private pending = new Map<string, Promise<CompletionOutcome>>();

  constructor(private repo: ProgressRepository, private now: () => Date = () => new Date()) {}

  get mode() {
    return this.repo.mode;
  }

  async init(): Promise<ProfileData> {
    if (!this.profile) this.profile = await this.repo.load();
    return this.profile;
  }

  current(): ProfileData {
    if (!this.profile) throw new Error('ProgressService.init() has not finished');
    return this.profile;
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  startSession(gameId: GameId, level: CefrLevel, contentIds: string[]): ActiveSession {
    return { sessionId: makeId(), gameId, level, startedAt: this.now().toISOString(), contentIds };
  }

  recentContent(gameId: GameId): string[] {
    return this.profile?.recentContent[gameId] ?? [];
  }

  bestScore(gameId: GameId, level: CefrLevel): number {
    return this.profile?.best[`${gameId}|${level}`] ?? 0;
  }

  /**
   * Records a finished (or quit) session exactly once. Calling it again with the same
   * session — a double click, a retry — returns the first outcome and awards nothing new.
   */
  completeSession(session: ActiveSession, result: GameResult): Promise<CompletionOutcome> {
    const inFlight = this.pending.get(session.sessionId);
    if (inFlight) return inFlight.then((o) => ({ ...o, duplicate: true }));
    const job = this.doComplete(session, result);
    this.pending.set(session.sessionId, job);
    return job;
  }

  private async doComplete(session: ActiveSession, result: GameResult): Promise<CompletionOutcome> {
    const profile = await this.init();
    const problems = validateResult(result, session);
    if (problems.length) throw new Error('Invalid game result: ' + problems.join('; '));

    const done = profile.sessions.find((s) => s.sessionId === session.sessionId);
    if (done || profile.processedSessionIds.includes(session.sessionId)) {
      return {
        record: done ?? toRecord(profile, session, result, { xp: 0, coins: 0, lines: [] }, this.now()),
        rewards: { xp: 0, coins: 0, lines: [] },
        achievements: [],
        personalBest: false,
        previousBest: this.bestScore(session.gameId, session.level),
        saved: { ok: true, mode: this.repo.mode },
        duplicate: true,
      };
    }

    const rewards = computeRewards(result);
    const record = toRecord(profile, session, result, rewards, this.now());
    const bestKey = `${session.gameId}|${session.level}`;
    const previousBest = profile.best[bestKey] ?? 0;
    const personalBest = result.status === 'completed' && result.score > previousBest;

    const recent = [...(profile.recentContent[session.gameId] ?? []).filter((id) => !record.contentIds.includes(id)), ...record.contentIds];
    const next: ProfileData = {
      ...profile,
      xp: profile.xp + rewards.xp,
      coins: profile.coins + rewards.coins,
      sessions: [...profile.sessions, record],
      best: personalBest ? { ...profile.best, [bestKey]: result.score } : profile.best,
      processedSessionIds: [...profile.processedSessionIds, session.sessionId],
      recentContent: { ...profile.recentContent, [session.gameId]: recent.slice(-RECENT_PER_GAME) },
    };
    const unlocked = newAchievements({ profile: next, record, previousBest });
    if (unlocked.length) {
      next.achievements = { ...next.achievements };
      for (const a of unlocked) next.achievements[a.id] = record.completedAt;
    }

    this.profile = next;
    const saved = await this.repo.save(next).catch((e: unknown) => ({ ok: false, mode: this.repo.mode, error: String(e) }) as SaveOutcome);
    this.listeners.forEach((fn) => fn(next));
    return { record, rewards, achievements: unlocked, personalBest, previousBest, saved, duplicate: false };
  }

  async resetProgress(): Promise<ProfileData> {
    this.profile = await this.repo.reset();
    this.pending.clear();
    this.listeners.forEach((fn) => fn(this.profile as ProfileData));
    return this.profile;
  }
}

function toRecord(profile: ProfileData, s: ActiveSession, r: GameResult, rewards: Rewards, now: Date): SessionRecord {
  const errorCategories: Partial<Record<SkillCategory, number>> = {};
  for (const a of r.answers) if (!a.correct) errorCategories[a.category] = (errorCategories[a.category] ?? 0) + 1;
  const answeredIds = r.answers.map((a) => a.itemId);
  return {
    sessionId: s.sessionId,
    studentId: profile.studentId,
    gameId: s.gameId,
    level: s.level,
    startedAt: s.startedAt,
    completedAt: now.toISOString(),
    status: r.status,
    score: r.score,
    correct: r.correct,
    incorrect: r.incorrect,
    accuracy: accuracyOf(r.correct, r.incorrect),
    challenges: r.challenges,
    bestCombo: r.bestCombo,
    // Content practised: everything for a finished game, only what was answered for a quit one.
    // Detective answers use "<caseId>:<questionId>" ids.
    contentIds: s.contentIds.filter((id) => r.status === 'completed' || answeredIds.some((a) => a === id || a.startsWith(id + ':'))),
    errorCategories,
    xp: rewards.xp,
    coins: rewards.coins,
    meta: r.meta,
  };
}
