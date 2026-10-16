import { CEFR_LEVELS, type CefrLevel } from './types';

export interface LevelBand {
  id: CefrLevel;
  title: string;
  focus: string;
}

/** Content bands. Guidelines only: validate against the Tronwell curriculum before production. */
export const LEVEL_BANDS: Record<CefrLevel, LevelBand> = {
  A0: { id: 'A0', title: 'Starter', focus: 'Words, colours, numbers, objects, animals and simple instructions' },
  A1: { id: 'A1', title: 'Elementary', focus: 'Present simple, the verb be, basic questions and everyday words' },
  A2: { id: 'A2', title: 'Pre-intermediate', focus: 'Past simple, present continuous, comparatives and future forms' },
  B1: { id: 'B1', title: 'Intermediate', focus: 'Present perfect, tense contrasts, conditionals and linking words' },
  B2: { id: 'B2', title: 'Upper-intermediate', focus: 'Complex conditionals, passive, reported speech and inference' },
};

/** Levels of the Tronwell Kids Practice Zone (same ids as its ?level= links). */
export interface PortalLevel {
  id: string;
  name: string;
  cefr: CefrLevel;
}

export const PORTAL_LEVELS: PortalLevel[] = [
  { id: 'tiny', name: 'Tiny Stars', cefr: 'A0' },
  { id: 'moon', name: 'Moon Walkers', cefr: 'A1' },
  { id: 'rocket', name: 'Rocket Riders', cefr: 'A1' },
  { id: 'planet', name: 'Planet Explorers', cefr: 'A2' },
  { id: 'comet', name: 'Comet Chasers', cefr: 'B1' },
  { id: 'galaxy', name: 'Galaxy Masters', cefr: 'B2' },
];

export function isCefr(v: unknown): v is CefrLevel {
  return typeof v === 'string' && (CEFR_LEVELS as readonly string[]).includes(v);
}

/** Accepts a portal level id (tiny … galaxy) or a CEFR code (a0 … b2), any case. */
export function parseLevel(raw: unknown): { cefr: CefrLevel; portalId?: string } | null {
  if (typeof raw !== 'string' || !raw) return null;
  const v = raw.trim().toLowerCase();
  const portal = PORTAL_LEVELS.find((p) => p.id === v);
  if (portal) return { cefr: portal.cefr, portalId: portal.id };
  const code = v.toUpperCase();
  if (isCefr(code)) return { cefr: code };
  return null;
}

export function levelLabel(cefr: CefrLevel, portalId?: string) {
  const portal = PORTAL_LEVELS.find((p) => p.id === portalId);
  return portal ? `${portal.name} · ${cefr}` : `Level ${cefr} · ${LEVEL_BANDS[cefr].title}`;
}
