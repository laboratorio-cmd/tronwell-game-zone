import { parseLevel } from '../education/levels';
import type { CefrLevel } from '../education/types';
import { readJson, writeJson, type KeyValueStore } from './storage';

/** Where the student's level came from. */
export type LevelSource = 'link' | 'portal' | 'chosen';

export interface StudentLevel {
  cefr: CefrLevel;
  portalId?: string;
  source: LevelSource;
  /** For 'chosen': the portal value at the time, so a newer placement test wins. */
  portalSnapshot?: string | null;
}

/** Game Zone's own key. */
export const LEVEL_KEY = 'twgz1_level';
/** Written by the Tronwell Kids Practice Zone when a student finishes the placement test. */
export const PORTAL_LEVEL_KEY = 'twk2_level';

/**
 * Resolves the level without inventing one:
 * 1. a teacher link (?level=rocket or ?level=A2), remembered for next time;
 * 2. a level that came from an earlier teacher link;
 * 3. a level chosen in Game Zone settings, unless the portal has a newer placement result;
 * 4. the placement-test result saved by the Tronwell Kids portal (same site, same browser);
 * otherwise null, and the app asks which Tronwell Kids level the student is in.
 */
export function resolveLevel(search: string, store: KeyValueStore): StudentLevel | null {
  const fromLink = parseLevel(new URLSearchParams(search).get('level'));
  if (fromLink) {
    const level: StudentLevel = { ...fromLink, source: 'link' };
    writeJson(store, LEVEL_KEY, level);
    return level;
  }
  const savedRaw = readJson<StudentLevel | null>(store, LEVEL_KEY, null);
  const saved = savedRaw && parseLevel(savedRaw.cefr) ? savedRaw : null;
  if (saved?.source === 'link') return saved;

  const portalRaw = readJson<string | null>(store, PORTAL_LEVEL_KEY, null);
  const portal = parseLevel(portalRaw);
  if (saved?.source === 'chosen' && (!portal || saved.portalSnapshot === portalRaw)) return saved;
  if (portal) return { ...portal, source: 'portal' };
  return null;
}

export function chooseLevel(store: KeyValueStore, cefr: CefrLevel, portalId?: string): StudentLevel {
  const level: StudentLevel = {
    cefr,
    portalId,
    source: 'chosen',
    portalSnapshot: readJson<string | null>(store, PORTAL_LEVEL_KEY, null),
  };
  writeJson(store, LEVEL_KEY, level);
  return level;
}
