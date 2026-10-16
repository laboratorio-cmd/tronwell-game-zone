import { CHARACTER_LOOKS, EVIDENCE_SPRITES, ICON_KEYS } from '../../../education/types';
import {
  ASTRO, BEACON_SPRITE, CAR_COLOURS, CHARACTERS, COIN, CONE, EVIDENCE, HEART, ICONS, MINE, SHIP, SPARK, SPIKES,
  TILE_FILL, TILE_TOP, carSprite, type SpriteDef,
} from './art';
import { asteroidCanvas, planetCanvas } from './procedural';

/**
 * Asset manifest: texture key -> source. Every texture the games use is listed here, so art
 * can be replaced without touching game logic.
 * - 'image': a PNG from public/assets (the Tronwell Kids Game Zone PNG asset pack).
 * - 'pixel': original ASCII pixel art (src/games/shared/pixel/art.ts), used where the pack
 *   has no matching sprite (vocabulary icons, some clues) and as a fallback.
 * - 'canvas': procedural art (planets).
 */
export type AssetSource =
  | { kind: 'pixel'; def: SpriteDef }
  | { kind: 'canvas'; draw: () => HTMLCanvasElement }
  | { kind: 'image'; url: string; clean?: boolean; inset?: number };

const png = (path: string, clean = false): AssetSource => ({ kind: 'image', url: `${import.meta.env.BASE_URL}assets/${path}.png`, clean });
const gb = (n: string) => png(`grammar-blaster/grammar_blaster_asset_${n}`);
const wj = (n: string, clean = false) => png(`word-jumper/word_jumper_asset_${n}`, clean);
const tr = (n: string, clean = false) => png(`tense-racer/tense_racer_asset_${n}`, clean);
const ed = (n: string, clean = false) => png(`english-detective/english_detective_asset_${n}`, clean);
const ui = (n: string) => png(`shared-ui/shared_ui_asset_${n}`);
/** Full-screen backgrounds (opaque, about 254×144 pixel art). inset trims the frame left by the concept sheet. */
const bg = (set: string, n: number): AssetSource => ({ kind: 'image', url: `${import.meta.env.BASE_URL}assets/backgrounds/${set}/0${n}-background.png`, inset: 10 });

export const ASSETS: Record<string, AssetSource> = {
  /* shared UI (PNG pack) */
  'ui-coin': ui('001'),
  'ui-shield': ui('003'),
  'ui-bolt': ui('004'),
  'ui-star': ui('005'),
  'ui-gem': ui('006'),
  'ui-trophy': ui('007'),
  'ui-crown': ui('008'),
  'ui-heart': ui('017'),
  'ui-heart-empty': ui('019'),
  'ui-music': ui('029'),
  'ui-sound': ui('030'),
  'ui-settings': ui('031'),
  'ui-close': ui('032'),
  'ui-pause': ui('010'),
  'ui-play': ui('011'),

  /* backgrounds */
  ...Object.fromEntries(
    (['grammar-blaster', 'word-jumper', 'tense-racer', 'english-detective', 'space-atmosphere'] as const).flatMap((set) =>
      [1, 2, 3, 4, 5, 6].map((n) => [`bg-${set}-${n}`, bg(set, n)]),
    ),
  ),

  /* Grammar Blaster */
  'gb-ship': gb('001'),
  'gb-ship-2': gb('002'),
  'gb-rock-lava': gb('005'),
  'gb-rock-blue': gb('006'),
  'gb-rock-dark': gb('007'),
  'gb-rock-purple': gb('011'),
  'gb-enemy-1': gb('012'),
  'gb-enemy-2': gb('013'),
  'gb-enemy-3': gb('014'),
  'gb-enemy-4': gb('015'),
  'gb-blast': gb('017'),
  'gb-laser': gb('018'),
  'gb-laser-gold': gb('020'),
  'gb-explosion': gb('022'),
  'gb-star': gb('024'),
  'gb-shield': gb('026'),
  'gb-boom': gb('028'),

  /* Word Jumper */
  'wj-run-1': wj('001'),
  'wj-run-2': wj('002'),
  'wj-run-3': wj('003'),
  'wj-idle': wj('004'),
  'wj-run-4': wj('005'),
  'wj-jump': wj('014'),
  'wj-ground': wj('007'),
  'wj-rock': wj('006'),
  'wj-pad': wj('008'),
  'wj-flag': wj('013'),
  'wj-crate': wj('015'),
  'wj-spring': wj('017'),
  'wj-gem-green': wj('018'),
  'wj-ufo': wj('019', true),
  'wj-alien': wj('020'),
  'wj-star': wj('021'),
  'wj-coin': wj('022'),
  'wj-gem-purple': wj('023'),
  'wj-robot': wj('024'),
  'wj-crab': wj('025', true),
  'wj-spikes': wj('026', true),
  'wj-book': wj('027'),

  /* Tense Racer */
  'tr-car-red': tr('001'),
  'tr-car-orange': tr('002'),
  'tr-car-blue': tr('003'),
  'tr-car-purple': tr('009'),
  'tr-barrier': tr('005'),
  'tr-barrier-blue': tr('006'),
  'tr-boost': tr('012'),
  'tr-fire': tr('013'),
  'tr-shield': tr('014'),
  'tr-bolt': tr('015'),
  'tr-rock': tr('019'),
  'tr-pebble': tr('020'),
  'tr-cone': tr('021'),
  'tr-drone': tr('022'),
  'tr-finish': tr('025'),
  'tr-trail-blue': tr('026'),
  'tr-trail-fire': tr('027'),
  'tr-smoke': tr('028'),
  'tr-cloud': tr('029'),

  /* English Detective */
  'ed-detective': ed('001'),
  'ed-walk-1': ed('002'),
  'ed-walk-2': ed('003'),
  'ed-walk-3': ed('004'),
  'ed-inspect': ed('005'),
  'ed-ask': ed('006'),
  'ed-laptop': ed('007'),
  'ed-photo': ed('008'),
  'ed-book': ed('009'),
  'ed-note': ed('013'),
  'ed-key': ed('015'),
  'ed-shelf': ed('017'),
  'ed-plant': ed('018'),
  'ed-door': ed('019'),
  'ed-cabinet': ed('020'),
  'ed-desk': ed('021'),
  'ed-screen': ed('022'),
  'ed-holo': ed('023'),
  'ed-boy-glasses': ed('010'),
  'ed-man-beard': ed('011'),
  'ed-officer': ed('012'),
  'ed-girl-ginger': ed('014'),
  'ed-girl-dark': ed('016', true),

  /* original pixel art (fallbacks and extras) */
  ship: { kind: 'pixel', def: SHIP },
  mine: { kind: 'pixel', def: MINE },
  astro: { kind: 'pixel', def: ASTRO },
  'tile-top': { kind: 'pixel', def: TILE_TOP },
  'tile-fill': { kind: 'pixel', def: TILE_FILL },
  spikes: { kind: 'pixel', def: SPIKES },
  beacon: { kind: 'pixel', def: BEACON_SPRITE },
  'car-player': { kind: 'pixel', def: carSprite(CAR_COLOURS.player) },
  cone: { kind: 'pixel', def: CONE },
  coin: { kind: 'pixel', def: COIN },
  heart: { kind: 'pixel', def: HEART },
  spark: { kind: 'pixel', def: SPARK },
  'planet-violet': { kind: 'canvas', draw: () => planetCanvas(3, 40, '#7957FF', '#B36BFF', true) },
  'planet-orange': { kind: 'canvas', draw: () => planetCanvas(8, 28, '#FF9F43', '#FFD166') },
  'planet-cyan': { kind: 'canvas', draw: () => planetCanvas(5, 22, '#2878FF', '#39D9FF') },
  'asteroid-0': { kind: 'canvas', draw: () => asteroidCanvas(11) },
};
for (const k of ICON_KEYS) ASSETS[`icon-${k}`] = { kind: 'pixel', def: ICONS[k] };
for (const k of EVIDENCE_SPRITES) ASSETS[`ev-${k}`] = { kind: 'pixel', def: EVIDENCE[k] };
for (const k of CHARACTER_LOOKS) if (CHARACTERS[k]) ASSETS[`char-${k}`] = { kind: 'pixel', def: CHARACTERS[k] };

/** Character look -> texture. PNG portraits first; old pixel looks stay as fallbacks. */
export const LOOK_TEXTURE: Record<string, string> = {
  'boy-glasses': 'ed-boy-glasses',
  'man-beard': 'ed-man-beard',
  officer: 'ed-officer',
  'girl-ginger': 'ed-girl-ginger',
  'girl-dark': 'ed-girl-dark',
  robot: 'wj-robot',
  alien: 'wj-alien',
  scientist: 'ed-boy-glasses',
  engineer: 'ed-man-beard',
  captain: 'ed-officer',
  'teen-b': 'ed-girl-ginger',
  'student-b': 'ed-girl-dark',
};
export const lookTexture = (look: string) => LOOK_TEXTURE[look] ?? `char-${look}`;

/** Evidence sprite -> texture: PNG where the pack has one, pixel art otherwise. */
const EVIDENCE_PNG: Partial<Record<string, string>> = {
  note: 'ed-note', photo: 'ed-photo', book: 'ed-book', key: 'ed-key', plant: 'ed-plant', tablet: 'ed-laptop', box: 'wj-crate',
};
export const evidenceTexture = (sprite: string) => EVIDENCE_PNG[sprite] ?? `ev-${sprite}`;

/** Resolves "icon:cat" style content references to a texture key, or null. */
export function iconTexture(ref: string | undefined): string | null {
  if (!ref?.startsWith('icon:')) return null;
  const key = `icon-${ref.slice(5)}`;
  return ASSETS[key] ? key : null;
}

/** URL for React <img> tags (PNG assets only). */
export function assetUrl(key: string): string | null {
  const a = ASSETS[key];
  return a?.kind === 'image' ? a.url : null;
}
