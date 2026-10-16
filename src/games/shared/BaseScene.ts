import Phaser from 'phaser';
import type { AnswerInput, AnswerOutcome } from '../../services/progress/scoring';
import { COLORS } from './pixel/palette';
import { createTextures } from './pixel/manifest';
import type { GameBridge, HudFeedback, HudPrompt, ResultMeta } from './types';

export const FONT = '"Nunito", "Segoe UI", system-ui, sans-serif';
export const PIXEL_FONT = '"Press Start 2P", monospace';

export function textStyle(size: number, color: string = COLORS.text, extra: Phaser.Types.GameObjects.Text.TextStyle = {}): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    fontFamily: FONT,
    fontStyle: '800',
    fontSize: `${size}px`,
    color,
    stroke: '#0B1024',
    strokeThickness: Math.max(3, Math.round(size / 7)),
    ...extra,
  };
}

let feedbackId = 0;

/** Common helpers shared by the four game scenes. */
export abstract class BaseScene<C = unknown, P = unknown> extends Phaser.Scene {
  protected bridge!: GameBridge<C, P>;
  protected W = 0;
  protected H = 0;
  private finished = false;
  private cleanups: (() => void)[] = [];

  constructor() {
    super({ key: 'main' });
  }

  init() {
    this.bridge = this.registry.get('bridge') as GameBridge<C, P>;
    this.W = this.scale.width;
    this.H = this.scale.height;
    this.finished = false;
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.runCleanups());
    this.events.once(Phaser.Scenes.Events.DESTROY, () => this.runCleanups());
  }

  /** Registers a function to run when the scene stops (listeners, timers…). */
  protected onCleanup(fn: () => void) {
    this.cleanups.push(fn);
  }

  private runCleanups() {
    const fns = this.cleanups;
    this.cleanups = [];
    fns.forEach((f) => f());
  }

  protected makeTextures(keys: string[]) {
    createTextures(this, keys);
  }

  /** Nearest-neighbour filtering for pixel art that is shown scaled up. */
  protected crisp(...keys: string[]) {
    for (const k of keys) if (this.textures.exists(k)) this.textures.get(k).setFilter(Phaser.Textures.FilterMode.NEAREST);
  }

  /** Full-screen background image that covers the view (cropped to keep its aspect ratio). */
  protected backdrop(key: string, opts: { scrollFactor?: number; dim?: number; w?: number; h?: number } = {}) {
    const { scrollFactor = 0, dim = 0, w = this.W, h = this.H } = opts;
    const tex = this.textures.get(key);
    const img = this.add.image(w / 2, h / 2, key, tex.has('inner') ? 'inner' : undefined).setScrollFactor(scrollFactor).setDepth(-200);
    img.setScale(Math.max(w / img.width, h / img.height));
    if (dim > 0) this.add.rectangle(w / 2, h / 2, w, h, 0x0b1024, dim).setScrollFactor(scrollFactor).setDepth(-199);
    return img;
  }

  /** 0 for A0 … 4 for B2: used to pick a background per level. */
  protected get levelIndex() {
    return ['A0', 'A1', 'A2', 'B1', 'B2'].indexOf(this.bridge.level);
  }

  /** True on phones/tablets (coarse pointer): hints mention tapping instead of keys. */
  protected get touch() {
    return this.bridge.input.touchUsed || !!window.matchMedia?.('(pointer: coarse)').matches;
  }

  protected get motion() {
    return !this.bridge.reducedMotion;
  }

  protected setPrompt(prompt: HudPrompt | null) {
    this.bridge.hud.set({ prompt });
  }

  protected feedback(kind: HudFeedback['kind'], title: string, text?: string, answer?: string) {
    this.bridge.hud.set({ feedback: { id: ++feedbackId, kind, title, text, answer } });
  }

  protected setProgress(done: number) {
    this.bridge.hud.set({ progressDone: done });
  }

  /** Records an answer with the shared ScoreKeeper and updates HUD, sound and effects. */
  protected answer(input: AnswerInput, at?: { x: number; y: number }): AnswerOutcome {
    const out = this.bridge.keeper.answer(input);
    if (out.duplicate) return out;
    const k = this.bridge.keeper;
    this.bridge.hud.set({ score: k.score, combo: k.combo, multiplier: out.multiplier });
    if (input.correct) {
      this.bridge.audio.sfx(out.multiplier > 1 && out.combo % 3 === 0 ? 'combo' : 'correct');
      if (at) this.floatText(at.x, at.y, `+${out.points}${out.multiplier > 1 ? `  ×${out.multiplier}` : ''}`, COLORS.yellow);
    } else {
      this.bridge.audio.sfx('wrong');
    }
    return out;
  }

  protected bonus(points: number, at?: { x: number; y: number }, label = '') {
    const added = this.bridge.keeper.addBonus(points);
    if (added > 0) {
      this.bridge.hud.set({ score: this.bridge.keeper.score });
      if (at) this.floatText(at.x, at.y, `${label}+${added}`, COLORS.cyan, 24);
    }
    return added;
  }

  protected floatText(x: number, y: number, text: string, color: string = COLORS.text, size = 30) {
    const t = this.add.text(x, y, text, textStyle(size, color)).setOrigin(0.5).setDepth(1000);
    this.tweens.add({ targets: t, y: y - 70, alpha: 0, duration: this.motion ? 900 : 1300, ease: 'Cubic.easeOut', onComplete: () => t.destroy() });
    return t;
  }

  /** Square pixel particles. */
  protected burst(x: number, y: number, colors: string[], count = 18, speed = 260) {
    if (!this.motion) count = Math.ceil(count / 3);
    for (let i = 0; i < count; i++) {
      const size = Phaser.Math.Between(4, 9);
      const r = this.add.rectangle(x, y, size, size, Phaser.Display.Color.HexStringToColor(colors[i % colors.length]).color).setDepth(900);
      const ang = Math.random() * Math.PI * 2;
      const sp = speed * (0.4 + Math.random() * 0.8);
      this.tweens.add({
        targets: r,
        x: x + Math.cos(ang) * sp * 0.6,
        y: y + Math.sin(ang) * sp * 0.6,
        alpha: 0,
        angle: Phaser.Math.Between(-180, 180),
        duration: 500 + Math.random() * 400,
        ease: 'Cubic.easeOut',
        onComplete: () => r.destroy(),
      });
    }
  }

  protected shake(intensity = 0.006, duration = 180) {
    if (this.motion) this.cameras.main.shake(duration, intensity);
  }

  /** Big centred banner (e.g. "MISSION COMPLETE"). */
  protected banner(text: string, color: string = COLORS.yellow, hold = 1200) {
    const cam = this.cameras.main;
    const t = this.add
      .text(cam.width / 2, cam.height / 2, text, { fontFamily: PIXEL_FONT, fontSize: `${Math.round(Math.min(cam.width, cam.height) / 16)}px`, color, stroke: '#0B1024', strokeThickness: 8, align: 'center' })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(2000)
      .setScale(0.6)
      .setAlpha(0);
    this.tweens.add({ targets: t, scale: 1, alpha: 1, duration: 260, ease: 'Back.easeOut' });
    this.time.delayedCall(hold, () => this.tweens.add({ targets: t, alpha: 0, duration: 250, onComplete: () => t.destroy() }));
    return t;
  }

  /** Ends the session once. */
  protected finishGame(meta?: ResultMeta) {
    if (this.finished) return;
    this.finished = true;
    this.bridge.finish(meta);
  }

  protected get isFinished() {
    return this.finished;
  }

  /** Scrolling pixel starfield drawn into the scene (behind everything). */
  protected makeStars(count: number, w = this.W, h = this.H) {
    const stars: { r: Phaser.GameObjects.Rectangle; speed: number }[] = [];
    const tints = [0xf5f7ff, 0xb7c1df, 0x39d9ff, 0xffd166];
    for (let i = 0; i < count; i++) {
      const layer = i % 3;
      const size = layer === 0 ? 2 : layer === 1 ? 3 : 4;
      const r = this.add
        .rectangle(Math.random() * w, Math.random() * h, size, size, tints[i % tints.length], layer === 2 ? 1 : 0.7)
        .setDepth(-100 + layer);
      stars.push({ r, speed: 20 + layer * 45 });
    }
    return stars;
  }
}
