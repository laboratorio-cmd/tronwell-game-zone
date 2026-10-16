import type { Rng } from '../../education/questionEngine';

/** Tile size in world pixels (16-pixel art drawn at 3×). */
export const TILE = 48;
/** The level is 15 tiles tall; the ground's top edge is row 12. */
export const LEVEL_ROWS = 15;
export const GROUND_ROW = 12;
export const LEVEL_H = LEVEL_ROWS * TILE;
export const GROUND_Y = GROUND_ROW * TILE;

export interface Solid { x: number; y: number; w: number; h: number } // tiles
export interface Spot { x: number; y: number } // world px (centre of a collectible)
export interface Patrol { x1: number; x2: number; y: number } // px

export interface LevelLayout {
  width: number; // px
  solids: Solid[];
  spikes: { x: number; w: number; row: number }[]; // tiles
  drones: Patrol[];
  coins: Spot[];
  /** Collectible positions for each mission, left to right. */
  spots: Spot[][];
  /** Checkpoint (beacon) x for each mission, px. */
  checkpoints: number[];
  /** Energy gate x after each mission, px. */
  gates: number[];
  portalX: number;
}

type Chunk = 'flat' | 'gap' | 'plat' | 'spikes' | 'high' | 'drone' | 'stairs';
const CHUNKS: Chunk[] = ['flat', 'gap', 'plat', 'spikes', 'high', 'drone', 'stairs'];
const ground = (x: number, w: number): Solid => ({ x, y: GROUND_ROW, w, h: LEVEL_ROWS - GROUND_ROW });
const px = (tiles: number) => tiles * TILE;

/**
 * Builds a side-scrolling level: one segment per mission, each with enough reachable
 * spots for that mission's collectibles, ending in an energy gate. Every chunk was
 * tuned for a 152 px jump (see JumperScene physics), so every spot is reachable.
 */
export function buildLevel(collectiblesPerMission: number[], minChunkTiles: number[], rng: Rng): LevelLayout {
  const L: LevelLayout = { width: 0, solids: [], spikes: [], drones: [], coins: [], spots: [], checkpoints: [], gates: [], portalX: 0 };
  let cx = 0;
  let last: Chunk | null = null;

  collectiblesPerMission.forEach((count, m) => {
    // start area with the checkpoint beacon
    L.solids.push(ground(cx, 6));
    L.checkpoints.push(px(cx + 2));
    cx += 6;
    const spots: Spot[] = [];
    for (let k = 0; k < count; k++) {
      let type: Chunk;
      do type = CHUNKS[Math.floor(rng() * CHUNKS.length)];
      while (type === last || (k === 0 && type === 'gap'));
      last = type;
      const w = Math.max(minChunkTiles[m] ?? 5, 6);
      spots.push(addChunk(L, type, cx, w, rng));
      cx += w;
    }
    L.spots.push(spots);
    L.solids.push(ground(cx, 7));
    L.gates.push(px(cx + 3));
    cx += 7;
  });

  L.solids.push(ground(cx, 14));
  L.portalX = px(cx + 6);
  cx += 14;
  L.width = px(cx);
  return L;
}

function addChunk(L: LevelLayout, type: Chunk, cx: number, w: number, rng: Rng): Spot {
  const mid = px(cx) + px(w) / 2;
  switch (type) {
    case 'flat':
      L.solids.push(ground(cx, w));
      if (rng() < 0.4) L.coins.push({ x: px(cx + 1) + 24, y: GROUND_Y - 120 });
      return { x: mid, y: GROUND_Y - 40 };
    case 'gap': {
      const gap = w >= 7 ? 3 : 2;
      const left = Math.floor((w - gap) / 2);
      L.solids.push(ground(cx, left), ground(cx + left + gap, w - left - gap));
      return { x: px(cx + left) + px(gap) / 2, y: GROUND_Y - 110 };
    }
    case 'plat': {
      L.solids.push(ground(cx, w), { x: cx + 1, y: GROUND_ROW - 2, w: w - 2, h: 1 });
      return { x: mid, y: GROUND_Y - px(2) - 40 };
    }
    case 'spikes': {
      L.solids.push(ground(cx, w));
      const sw = w >= 7 ? 2 : 1;
      const sx = cx + Math.floor((w - sw) / 2);
      L.spikes.push({ x: sx, w: sw, row: GROUND_ROW - 1 });
      return { x: px(sx) + px(sw) / 2, y: GROUND_Y - 120 };
    }
    case 'high': {
      // low step (2 tiles up), then a one-tile gap, then the high step (4 tiles up)
      const bw = Math.min(3, w - 3);
      L.solids.push(ground(cx, w), { x: cx, y: GROUND_ROW - 2, w: 2, h: 1 }, { x: cx + 3, y: GROUND_ROW - 4, w: bw, h: 1 });
      if (rng() < 0.6) L.coins.push({ x: px(cx + 1), y: GROUND_Y - px(2) - 40 });
      return { x: px(cx + 3) + px(bw) / 2, y: GROUND_Y - px(4) - 40 };
    }
    case 'drone': {
      L.solids.push(ground(cx, w));
      L.drones.push({ x1: px(cx) + 30, x2: px(cx + w) - 30, y: GROUND_Y - 26 });
      return { x: mid, y: GROUND_Y - 130 };
    }
    case 'stairs': {
      L.solids.push(ground(cx, w), { x: cx + 1, y: GROUND_ROW - 1, w: 1, h: 1 }, { x: cx + 2, y: GROUND_ROW - 2, w: Math.max(2, w - 3), h: 2 });
      return { x: px(cx + 2) + px(Math.max(2, w - 3)) / 2, y: GROUND_Y - px(2) - 40 };
    }
  }
}
