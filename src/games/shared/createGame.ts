import type Phaser from 'phaser';
import type { GameBridge, GameDefinition } from './types';

/** Logical canvas size that matches the stage's shape (the canvas is scaled to fit). */
export function fitSize(w: number, h: number) {
  const aspect = w > 0 && h > 0 ? w / h : 16 / 9;
  if (aspect >= 1) return { width: Math.round(Math.min(1700, Math.max(960, 720 * aspect))), height: 720 };
  return { width: 720, height: Math.round(Math.min(1500, Math.max(900, 720 / aspect))) };
}

async function fontsReady() {
  if (typeof document === 'undefined' || !document.fonts) return;
  try {
    await Promise.race([
      Promise.all([document.fonts.load('800 32px "Nunito"'), document.fonts.load('16px "Press Start 2P"')]),
      new Promise((r) => setTimeout(r, 1500)),
    ]);
  } catch {
    /* fall back to system fonts */
  }
}

/** Creates one Phaser game inside `parent`. The caller must destroy it (game.destroy(true)). */
export async function createGame<C, P>(parent: HTMLElement, def: GameDefinition<C, P>, bridge: GameBridge<C, P>) {
  const [{ default: PhaserLib }, SceneClass] = await Promise.all([import('phaser'), def.loadScene(), fontsReady()]);
  const size = def.fixedSize ?? fitSize(parent.clientWidth, parent.clientHeight);
  // Dev-only: ?timerloop drives the game with timers so it can be tested in a background tab.
  const timerLoop = import.meta.env.DEV && new URLSearchParams(window.location.search).has('timerloop');
  const game: Phaser.Game = new PhaserLib.Game({
    fps: timerLoop ? { forceSetTimeOut: true, target: 60 } : undefined,
    type: PhaserLib.AUTO,
    parent,
    width: size.width,
    height: size.height,
    transparent: true,
    banner: false,
    audio: { noAudio: true },
    input: { activePointers: 3, keyboard: false },
    render: { antialias: true, pixelArt: false, roundPixels: false },
    physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
    scale: { mode: PhaserLib.Scale.FIT, autoCenter: PhaserLib.Scale.CENTER_BOTH },
    scene: [],
  });
  game.registry.set('bridge', bridge);
  game.scene.add('main', SceneClass, true);
  return game;
}
