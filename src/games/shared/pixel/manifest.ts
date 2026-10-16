import Phaser from 'phaser';
import { ASSETS } from './assets';
import { frameSize, spriteCanvas } from './render';

export * from './assets';

/** Call from a scene's preload(): queues PNG files. */
export function preloadAssets(scene: Phaser.Scene, keys: string[]) {
  for (const key of keys) {
    const a = ASSETS[key];
    if (a?.kind === 'image' && !scene.textures.exists(key)) scene.load.image(key, a.url);
  }
}

/** Removes stray bits that the atlas extraction left next to a sprite (keeps the biggest shape). */
function keepLargestShape(img: HTMLImageElement | HTMLCanvasElement): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) return c;
  ctx.drawImage(img, 0, 0);
  const { width: w, height: h } = c;
  const data = ctx.getImageData(0, 0, w, h);
  const a = (i: number) => data.data[i * 4 + 3] > 20;
  const label = new Int32Array(w * h).fill(-1);
  const sizes: number[] = [];
  for (let start = 0; start < w * h; start++) {
    if (label[start] !== -1 || !a(start)) continue;
    const id = sizes.length;
    let size = 0;
    const stack = [start];
    label[start] = id;
    while (stack.length) {
      const p = stack.pop() as number;
      size++;
      const x = p % w;
      const y = (p - x) / w;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const q = ny * w + nx;
        if (label[q] === -1 && a(q)) {
          label[q] = id;
          stack.push(q);
        }
      }
    }
    sizes.push(size);
  }
  const keep = sizes.indexOf(Math.max(...sizes));
  for (let i = 0; i < w * h; i++) if (label[i] !== keep) data.data[i * 4 + 3] = 0;
  ctx.putImageData(data, 0, 0);
  return c;
}

/** Call from a scene's create(): builds pixel/procedural textures and cleans PNGs (once per game). */
export function createTextures(scene: Phaser.Scene, keys: string[]) {
  for (const key of keys) {
    const a = ASSETS[key];
    if (!a) throw new Error(`Unknown asset "${key}"`);
    if (a.kind === 'image') {
      const tex = scene.textures.get(key);
      if (a.inset && tex && !tex.has('inner')) {
        const src = tex.getSourceImage();
        tex.add('inner', 0, a.inset, a.inset, src.width - a.inset * 2, src.height - a.inset * 2);
        tex.setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
      if (a.clean && tex && !(tex.customData as { cleaned?: boolean }).cleaned) {
        const canvas = keepLargestShape(tex.getSourceImage() as HTMLImageElement);
        scene.textures.remove(key);
        const fresh = scene.textures.addCanvas(key, canvas);
        if (fresh) (fresh.customData as { cleaned?: boolean }).cleaned = true;
      }
      continue;
    }
    if (scene.textures.exists(key)) continue;
    const canvas = a.kind === 'pixel' ? spriteCanvas(a.def) : a.draw();
    const tex = scene.textures.addCanvas(key, canvas);
    if (!tex) continue;
    if (a.kind === 'pixel') {
      const { w, h } = frameSize(a.def);
      a.def.frames.forEach((_, i) => tex.add(i, 0, i * w, 0, w, h));
    }
    tex.setFilter(Phaser.Textures.FilterMode.NEAREST);
  }
}

