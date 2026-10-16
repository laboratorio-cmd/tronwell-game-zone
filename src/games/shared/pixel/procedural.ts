import { seededRng } from '../../../education/questionEngine';
import { PALETTE } from './palette';

/**
 * Procedural pixel art (asteroids, planets) drawn at low resolution so it matches the
 * hand-made sprites when scaled up with nearest-neighbour filtering.
 */
export function asteroidCanvas(seed: number, size = 26): HTMLCanvasElement {
  const rng = seededRng(seed);
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  const r0 = size / 2 - 1.5;
  const bumps = [...Array(7)].map(() => ({ a: rng() * Math.PI * 2, k: 0.6 + rng() * 1.6, amp: 0.05 + rng() * 0.08 }));
  const craters = [...Array(4)].map(() => ({ x: 0.25 + rng() * 0.5, y: 0.25 + rng() * 0.5, r: 0.07 + rng() * 0.09 }));
  const radius = (ang: number) => r0 * (1 - bumps.reduce((s, b) => s + b.amp * (0.5 + 0.5 * Math.cos(b.k * (ang - b.a))), 0) * 0.9);
  const inside = (x: number, y: number) => {
    const dx = x - size / 2;
    const dy = y - size / 2;
    return Math.hypot(dx, dy) <= radius(Math.atan2(dy, dx));
  };
  const shades = [PALETTE.S, PALETTE.G, '#525C80', PALETTE.g];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!inside(x + 0.5, y + 0.5)) continue;
      const edge = !inside(x - 0.5, y + 0.5) || !inside(x + 1.5, y + 0.5) || !inside(x + 0.5, y - 0.5) || !inside(x + 0.5, y + 1.5);
      if (edge) {
        ctx.fillStyle = PALETTE.K;
      } else {
        // light from the top-left
        const nx = (x - size / 2) / r0;
        const ny = (y - size / 2) / r0;
        const light = -(nx * 0.6 + ny * 0.8);
        let idx = light > 0.45 ? 0 : light > 0 ? 1 : light > -0.45 ? 2 : 3;
        for (const cr of craters) {
          const d = Math.hypot(x / size - cr.x, y / size - cr.y);
          if (d < cr.r) idx = Math.min(3, idx + (d < cr.r * 0.6 ? 2 : 1));
        }
        ctx.fillStyle = shades[idx];
      }
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return c;
}

export function planetCanvas(seed: number, size: number, base: string, band: string, ring = false): HTMLCanvasElement {
  const rng = seededRng(seed);
  const c = document.createElement('canvas');
  c.width = size * (ring ? 2 : 1);
  c.height = size;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  const ox = ring ? size / 2 : 0;
  const r = size / 2 - 1;
  const bands = [...Array(4)].map(() => 0.2 + rng() * 0.6);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - size / 2;
      const dy = y + 0.5 - size / 2;
      const d = Math.hypot(dx, dy);
      if (d > r) continue;
      const shade = (dx + dy) / r;
      let col = bands.some((b) => Math.abs(y / size - b) < 0.04) ? band : base;
      if (shade > 0.55) col = PALETTE.D;
      else if (d > r - 1.2) col = PALETTE.K;
      ctx.fillStyle = col;
      ctx.fillRect(ox + x, y, 1, 1);
    }
  }
  if (ring) {
    // Tilted ellipse; the back half is hidden behind the planet.
    const cx = size;
    const cy = size / 2;
    const a = size * 0.92;
    const b = size * 0.2;
    for (let i = 0; i < 720; i++) {
      const t = (i / 720) * Math.PI * 2;
      const x = Math.round(cx + a * Math.cos(t));
      const y = Math.round(cy + b * Math.sin(t) - (Math.cos(t) * size) / 10);
      const behind = Math.sin(t) < 0 && Math.hypot(x + 0.5 - cx, y + 0.5 - cy) < r;
      if (behind) continue;
      ctx.fillStyle = Math.sin(t) > 0.3 ? PALETTE.Y : PALETTE.y;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return c;
}
