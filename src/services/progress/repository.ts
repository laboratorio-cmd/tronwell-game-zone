import { makeId, readJson, writeJson, type KeyValueStore } from '../storage';
import type { ProfileData, SaveOutcome, StorageMode } from './types';

/**
 * Where progress is stored. The Tronwell Kids portal has no accounts or server, so the
 * MVP ships a device repository. A remote repository (school backend) can implement the
 * same interface later; it must validate results on the server.
 */
export interface ProgressRepository {
  readonly mode: StorageMode;
  load(): Promise<ProfileData>;
  save(profile: ProfileData): Promise<SaveOutcome>;
  reset(): Promise<ProfileData>;
}

export const PROFILE_KEY = 'twgz1_profile';
const MAX_SESSIONS = 200;
const MAX_PROCESSED = 500;

export function emptyProfile(now = new Date()): ProfileData {
  return {
    version: 1,
    studentId: makeId(),
    createdAt: now.toISOString(),
    xp: 0,
    coins: 0,
    sessions: [],
    best: {},
    achievements: {},
    processedSessionIds: [],
    recentContent: {},
  };
}

function sane(p: unknown): p is ProfileData {
  const v = p as ProfileData;
  return !!v && v.version === 1 && typeof v.studentId === 'string' && Array.isArray(v.sessions)
    && typeof v.xp === 'number' && typeof v.best === 'object' && Array.isArray(v.processedSessionIds);
}

/** Stores the profile in this browser (localStorage) or, if storage is blocked, in memory only. */
export class DeviceProgressRepository implements ProgressRepository {
  readonly mode: StorageMode;

  constructor(private store: KeyValueStore, persistent: boolean) {
    this.mode = persistent ? 'local' : 'memory';
  }

  async load(): Promise<ProfileData> {
    const raw = readJson<unknown>(this.store, PROFILE_KEY, null);
    if (sane(raw)) return { ...emptyProfile(), ...raw };
    const fresh = emptyProfile();
    writeJson(this.store, PROFILE_KEY, fresh);
    return fresh;
  }

  async save(profile: ProfileData): Promise<SaveOutcome> {
    const trimmed: ProfileData = {
      ...profile,
      sessions: profile.sessions.slice(-MAX_SESSIONS),
      processedSessionIds: profile.processedSessionIds.slice(-MAX_PROCESSED),
    };
    const ok = writeJson(this.store, PROFILE_KEY, trimmed);
    if (!ok) return { ok: false, mode: this.mode, error: 'This browser could not save your progress (storage is full or blocked).' };
    return { ok: this.mode === 'local', mode: this.mode, error: this.mode === 'memory' ? 'Storage is blocked in this browser, so progress is lost when you close the page.' : undefined };
  }

  async reset(): Promise<ProfileData> {
    const fresh = emptyProfile();
    writeJson(this.store, PROFILE_KEY, fresh);
    return fresh;
  }
}
