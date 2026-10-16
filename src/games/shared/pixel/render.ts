import { PALETTE } from './palette';
import type { SpriteDef } from './art';

export function frameSize(def: SpriteDef) {
  let w = 0;
  let h = 0;
  for (const f of def.frames) {
    h = Math.max(h, f.length);
    for (const row of f) w = Math.max(w, row.length);
  }
  return { w, h };
}

/** Draws every frame side by side, one canvas pixel per sprite pixel (times `scale`). */
export function spriteCanvas(def: SpriteDef, scale = 1): HTMLCanvasElement {
  const { w, h } = frameSize(def);
  const canvas = document.createElement('canvas');
  canvas.width = w * def.frames.length * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const colours = { ...PALETTE, ...def.palette };
  def.frames.forEach((rows, f) => {
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const c = colours[row[x]];
        if (!c) continue;
        ctx.fillStyle = c;
        ctx.fillRect((f * w + x) * scale, y * scale, scale, scale);
      }
    });
  });
  return canvas;
}

const urlCache = new Map<string, string>();

/** PNG data URL of one frame, for <img> tags in the React UI (use image-rendering: pixelated). */
export function spriteDataUrl(cacheKey: string, def: SpriteDef, scale = 4, frame = 0): string {
  const key = `${cacheKey}@${scale}#${frame}`;
  const hit = urlCache.get(key);
  if (hit) return hit;
  if (typeof document === 'undefined') return '';
  const single: SpriteDef = { frames: [def.frames[frame] ?? def.frames[0]], palette: def.palette };
  const url = spriteCanvas(single, scale).toDataURL('image/png');
  urlCache.set(key, url);
  return url;
}
