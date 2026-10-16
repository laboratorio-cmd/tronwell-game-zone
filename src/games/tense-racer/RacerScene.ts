import Phaser from 'phaser';
import { checkOrder, filledSentence, orderSentence } from '../../education/questionEngine';
import { BaseScene, FONT, textStyle } from '../shared/BaseScene';
import { digitIndex } from '../shared/input';
import { preloadAssets } from '../shared/pixel/manifest';
import { COLORS } from '../shared/pixel/palette';
import { closedPit, type PitPanel, type RaceChallenge, type RacerContent } from './definition';

const ASSET_KEYS = ['tr-car-blue', 'tr-car-red', 'tr-car-orange', 'tr-car-purple', 'tr-barrier', 'tr-cone', 'tr-rock', 'tr-finish', 'tr-trail-blue', 'tr-smoke', 'tr-boost', 'bg-tense-racer-3', 'bg-space-atmosphere-4'];

const CRUISE = 520;
const TOP = 640;
const TURBO = 980;
const SLOW = 280;
const STEER = 430;
const FIRST_AT = 1600;
const GAP = 2600;
const FINISH_AFTER = 2300;

/** factor: speed relative to the player's normal pace (without turbo or crashes). */
interface Rival { img: Phaser.GameObjects.Image; dist: number; factor: number; lane: number; y: number }
interface Obstacle { img: Phaser.GameObjects.Image; dist: number; lane: number; hit: boolean }
interface Stop {
  challenge: RaceChallenge;
  dist: number;
  announced: boolean;
  done: boolean;
  readDist: number;
  gfx: Phaser.GameObjects.Container | null;
}

export class RacerScene extends BaseScene<RacerContent, PitPanel> {
  private car!: Phaser.GameObjects.Image;
  private trail!: Phaser.GameObjects.Image;
  private carX = 0;
  private carY = 0;
  private dist = 0;
  private speed = 0;
  private boostUntil = 0;
  private slowUntil = 0;
  private roadTop = 0;
  private roadBottom = 0;
  private laneH = 0;
  private barriers: Phaser.GameObjects.TileSprite[] = [];
  private rivals: Rival[] = [];
  private obstacles: Obstacle[] = [];
  private stops: Stop[] = [];
  private active: Stop | null = null;
  private targetLane: number | null = null;
  private pitOpen = false;
  private pitStarted = 0;
  private finishDist = 0;
  private raceOver = false;
  private started = false;
  private elapsed = 0;
  private statTick = 0;
  private timerTick = 0;
  private done = 0;

  preload() {
    preloadAssets(this, ASSET_KEYS);
  }

  create() {
    this.makeTextures(ASSET_KEYS);
    this.crisp('bg-tense-racer-3');
    const W = this.W;
    const H = this.H;
    this.roadTop = Math.round(H * 0.4);
    this.roadBottom = Math.round(H * 0.95);
    this.laneH = (this.roadBottom - this.roadTop) / 3;
    this.carX = Math.round(W * 0.2);

    // sky
    this.backdrop('bg-tense-racer-3', { h: this.roadTop + 40, w: W, dim: 0.15 });
    // road
    const g = this.add.graphics().setDepth(-50);
    g.fillStyle(0x161c38, 1).fillRect(0, this.roadTop, W, this.roadBottom - this.roadTop);
    g.fillStyle(0x0b1024, 1).fillRect(0, this.roadBottom, W, H - this.roadBottom);
    g.fillStyle(0xff9f43, 1).fillRect(0, this.roadTop, W, 4).fillRect(0, this.roadBottom - 4, W, 4);
    // dashed lane lines (one texture, scrolled)
    const dash = this.make.graphics({}, false);
    dash.fillStyle(0xffd166, 0.9).fillRect(0, 0, 70, 6);
    dash.generateTexture('tr-dash', 140, 6);
    dash.destroy();
    for (let i = 1; i < 3; i++) {
      this.barriers.push(this.add.tileSprite(0, this.roadTop + this.laneH * i, W, 6, 'tr-dash').setOrigin(0, 0.5).setDepth(-40));
    }
    for (const y of [this.roadTop - 8, this.roadBottom + 6]) {
      const b = this.add.tileSprite(0, y, W, 45, 'tr-barrier').setOrigin(0, 0.5).setDepth(-30).setTileScale(0.8, 0.8);
      b.height = 36;
      this.barriers.push(b);
    }

    // player
    this.carY = this.laneY(1);
    this.trail = this.add.image(this.carX - 120, this.carY, 'tr-trail-blue').setDepth(19).setAlpha(0).setScale(1.2, 1);
    this.car = this.add.image(this.carX, this.carY, 'tr-car-blue').setDepth(20);
    this.car.setScale((this.laneH * 0.78) / this.car.height);

    // rivals start on the grid
    const rivalKeys = ['tr-car-red', 'tr-car-orange', 'tr-car-purple'];
    // Tuned so all-correct answers usually win, about half right lands 2nd–3rd, none right is last.
    const factors = [0.97, 1.06, 1.15].map((f) => f * (this.bridge.level === 'A0' ? 0.95 : 1));
    rivalKeys.forEach((key, i) => {
      const lane = [0, 2, 1][i];
      const img = this.add.image(0, this.laneY(lane), key).setDepth(18);
      img.setScale((this.laneH * 0.78) / img.height);
      this.rivals.push({ img, dist: 60 + i * 110, factor: factors[i], lane, y: this.laneY(lane) });
    });

    // challenges along the track
    const ch = this.bridge.content.challenges;
    ch.forEach((c, i) => {
      const len = c.kind === 'gate' ? c.choice.item.prompt.length : 0;
      const readTime = Phaser.Math.Clamp(4 + len / 14, 5, 10);
      this.stops.push({ challenge: c, dist: FIRST_AT + i * GAP + (c.kind === 'gate' ? readTime * CRUISE * 0.5 : 0), announced: false, done: false, readDist: c.kind === 'gate' ? readTime * CRUISE : 900, gfx: null });
    });
    // keep challenges apart even with long reading windows
    for (let i = 1; i < this.stops.length; i++) {
      const min = this.stops[i - 1].dist + this.stops[i].readDist + 1900;
      if (this.stops[i].dist < min) this.stops[i].dist = min;
    }
    this.finishDist = (this.stops[this.stops.length - 1]?.dist ?? FIRST_AT) + FINISH_AFTER;
    this.placeObstacles();

    this.bridge.hud.set({ progressTotal: this.stops.length, stat: { label: 'POS', value: '–' } });
    this.setPrompt({ kicker: 'Tense Racer', text: this.touch ? 'Get ready… use ▲ ▼ to pick the right gates!' : 'Get ready… steer with ↑ ↓ and pick the right gates!' });

    // pit-stop panel messages
    this.onCleanup(this.bridge.channel.on<number>('pit-pick', (i) => this.pitPick(i)));
    this.onCleanup(this.bridge.channel.on('pit-undo', () => this.pitUndo()));
    this.onCleanup(this.bridge.channel.on('pit-clear', () => this.pitClear()));
    this.onCleanup(this.bridge.channel.on('pit-continue', () => this.pitContinue()));
    this.onCleanup(
      this.bridge.input.onKey((code) => {
        const d = digitIndex(code);
        if (this.pitOpen) {
          const p = this.bridge.panel.get();
          if (p.result) {
            if (code === 'Enter' || code === 'Space') this.pitContinue();
            return;
          }
          if (d !== null) {
            const remaining = p.chunks.map((_, i) => i).filter((i) => !p.picked.includes(i));
            if (remaining[d] !== undefined) this.pitPick(remaining[d]);
          }
          if (code === 'Backspace') this.pitUndo();
          return;
        }
        if (d !== null && d < 3 && this.active?.challenge.kind === 'gate') this.targetLane = d;
      }),
    );
    this.onCleanup(() => this.bridge.panel.replace(closedPit()));

    // countdown
    const lights = ['3', '2', '1', 'GO!'];
    lights.forEach((t, i) => this.time.delayedCall(i * 650, () => {
      this.banner(t, i === 3 ? COLORS.good : COLORS.yellow, 450);
      this.bridge.audio.sfx(i === 3 ? 'boost' : 'tick');
      if (i === 3) {
        this.started = true;
        this.speed = CRUISE * 0.6;
        this.setPrompt({ kicker: 'Race on!', text: 'Watch for the next gate…' });
      }
    }));
  }

  private laneY(lane: number) {
    return this.roadTop + this.laneH * (lane + 0.5);
  }

  private laneOf(y: number) {
    return Phaser.Math.Clamp(Math.floor((y - this.roadTop) / this.laneH), 0, 2);
  }

  private screenX(dist: number) {
    return this.carX + (dist - this.dist);
  }

  private placeObstacles() {
    const keys = ['tr-cone', 'tr-rock', 'tr-cone'];
    for (let i = 0; i <= this.stops.length; i++) {
      const from = i === 0 ? 700 : this.stops[i - 1].dist + 500;
      const to = i < this.stops.length ? this.stops[i].dist - this.stops[i].readDist - 300 : this.finishDist - 400;
      for (let d = from; d < to; d += Phaser.Math.Between(650, 1000)) {
        const lane = Phaser.Math.Between(0, 2);
        const key = keys[Phaser.Math.Between(0, keys.length - 1)];
        const img = this.add.image(-200, this.laneY(lane), key).setDepth(15);
        img.setScale((this.laneH * (key === 'tr-rock' ? 0.55 : 0.5)) / img.height);
        this.obstacles.push({ img, dist: d, lane, hit: false });
      }
    }
  }

  /* ---------------- challenges ---------------- */

  private announce(s: Stop) {
    s.announced = true;
    this.active = s;
    const c = s.challenge;
    const idx = this.stops.indexOf(s);
    this.bridge.hud.set({ progressLabel: `Challenge ${idx + 1}/${this.stops.length}`, feedback: null });
    if (c.kind === 'gate') {
      this.setPrompt({ kicker: this.touch ? 'Gate ahead · change lane to the right answer' : 'Gate ahead · steer into the right answer (or press 1–3)', text: c.choice.item.prompt, options: c.choice.options });
      s.gfx = this.buildGates(c.choice.options);
    } else {
      this.setPrompt({ kicker: 'Pit stop ahead', text: c.item.prompt ?? 'Put the words in the right order.' });
      s.gfx = this.buildPit();
    }
  }

  private buildGates(options: string[]) {
    const parts: Phaser.GameObjects.GameObject[] = [];
    options.slice(0, 3).forEach((opt, lane) => {
      const y = this.laneY(lane) - this.roadTop;
      const g = this.add.graphics();
      g.fillStyle(0x39d9ff, 0.18).fillRect(-14, y - this.laneH / 2 + 6, 28, this.laneH - 12);
      g.lineStyle(4, 0x39d9ff, 1).strokeRect(-14, y - this.laneH / 2 + 6, 28, this.laneH - 12);
      const label = this.add.text(30, y, opt, textStyle(28, COLORS.text)).setOrigin(0, 0.5);
      const bg = this.add.graphics();
      bg.fillStyle(0x10172f, 0.9).fillRoundedRect(20, y - 24, label.width + 58, 48, 10);
      bg.lineStyle(3, 0xffd166, 1).strokeRoundedRect(20, y - 24, label.width + 58, 48, 10);
      label.setX(64);
      const n = this.add.text(42, y, String(lane + 1), { fontFamily: FONT, fontStyle: '900', fontSize: '22px', color: '#10172F', backgroundColor: '#FFD166', padding: { x: 6, y: 0 } }).setOrigin(0.5);
      parts.push(g, bg, label, n);
    });
    return this.add.container(-500, this.roadTop, parts).setDepth(16);
  }

  private buildPit() {
    const g = this.add.graphics();
    const h = this.roadBottom - this.roadTop;
    for (let i = 0; i < 8; i++) g.fillStyle(i % 2 ? 0xff9f43 : 0x0b1024, 0.85).fillRect(-30 + i * 8, 0, 8, h);
    const t = this.add.text(30, -36, 'PIT STOP', { fontFamily: '"Press Start 2P", monospace', fontSize: '22px', color: '#FFD166', stroke: '#0B1024', strokeThickness: 6 });
    return this.add.container(-500, this.roadTop, [g, t]).setDepth(16);
  }

  private resolveGate(s: Stop) {
    if (s.challenge.kind !== 'gate') return;
    const c = s.challenge.choice;
    const lane = this.laneOf(this.carY);
    const given = c.options[lane] ?? '(missed)';
    const correct = lane === c.correctIndex;
    const item = c.item;
    this.answer({ itemId: item.id, correct, category: item.category, difficulty: item.difficulty, prompt: item.prompt, expected: c.options[c.correctIndex], given, feedback: item.feedback }, { x: this.carX, y: this.carY - 70 });
    if (correct) {
      this.feedback('correct', 'TURBO!', item.feedback, filledSentence(item));
      this.turbo(2500);
    } else {
      this.feedback('wrong', `Not “${given}”.`, item.feedback, filledSentence(item));
      this.slowUntil = this.time.now + 900;
      this.shake(0.005, 150);
    }
    this.closeStop(s);
  }

  private closeStop(s: Stop) {
    s.done = true;
    this.active = null;
    this.targetLane = null;
    this.done++;
    this.bridge.hud.set({ progressDone: this.done, timer: null });
    if (s.gfx) {
      const gfx = s.gfx;
      this.tweens.add({ targets: gfx, alpha: 0, duration: 500, onComplete: () => gfx.destroy() });
      s.gfx = null;
    }
    this.time.delayedCall(2600, () => {
      if (!this.active && !this.raceOver) this.setPrompt({ kicker: 'Keep racing!', text: this.done < this.stops.length ? 'Next challenge coming up…' : 'Go for the finish line!' });
    });
  }

  private turbo(ms: number) {
    this.boostUntil = this.time.now + ms;
    this.bridge.audio.sfx('boost');
  }

  /* pit stop */

  private openPit(s: Stop) {
    if (s.challenge.kind !== 'pit') return;
    this.pitOpen = true;
    this.pitStarted = this.time.now;
    this.speed = 0;
    this.bridge.input.clear();
    this.bridge.panel.replace({
      open: true,
      instruction: s.challenge.item.prompt ?? 'Tap the words in the right order.',
      chunks: s.challenge.chunks,
      picked: [],
      result: null,
      answer: orderSentence(s.challenge.item),
      punctuation: s.challenge.item.punctuation,
    });
    this.setPrompt({ kicker: 'Pit stop · build the sentence to refuel', text: s.challenge.item.prompt ?? 'Put the words in the right order.' });
  }

  private pitPick(i: number) {
    const p = this.bridge.panel.get();
    if (!this.pitOpen || p.result || p.picked.includes(i) || i < 0 || i >= p.chunks.length) return;
    const picked = [...p.picked, i];
    this.bridge.audio.sfx('click');
    this.bridge.panel.set({ picked });
    if (picked.length === p.chunks.length) this.pitCheck(picked);
  }

  private pitUndo() {
    const p = this.bridge.panel.get();
    if (!this.pitOpen || p.result || !p.picked.length) return;
    this.bridge.panel.set({ picked: p.picked.slice(0, -1) });
  }

  private pitClear() {
    if (!this.pitOpen || this.bridge.panel.get().result) return;
    this.bridge.panel.set({ picked: [] });
  }

  private pitCheck(picked: number[]) {
    const s = this.active;
    if (!s || s.challenge.kind !== 'pit') return;
    const { item, chunks } = s.challenge;
    const attempt = picked.map((i) => chunks[i]);
    const correct = checkOrder(item, attempt);
    const at = { x: this.carX, y: this.carY - 70 };
    this.answer({ itemId: item.id, correct, category: item.category, difficulty: item.difficulty, prompt: item.prompt ? `${item.prompt} ${item.chunks.join(' / ')}` : item.chunks.join(' / '), given: orderSentence(item, attempt), expected: orderSentence(item), feedback: item.feedback }, at);
    if (correct) {
      const secs = (this.time.now - this.pitStarted) / 1000;
      this.bonus(Math.max(0, Math.round(160 - secs * 8)), at, 'Fast pit ');
      this.feedback('correct', 'Perfect sentence!', item.feedback, orderSentence(item));
    } else {
      this.feedback('wrong', 'Not quite.', item.feedback, orderSentence(item));
    }
    this.bridge.panel.set({ result: correct ? 'correct' : 'wrong' });
  }

  private pitContinue() {
    const p = this.bridge.panel.get();
    if (!this.pitOpen || !p.result) return;
    const s = this.active;
    this.pitOpen = false;
    this.bridge.panel.replace(closedPit());
    if (p.result === 'correct') this.turbo(3000);
    this.speed = CRUISE * 0.5;
    if (s) this.closeStop(s);
  }

  /* ---------------- loop ---------------- */

  update(time: number, deltaMs: number) {
    const dt = Math.min(deltaMs, 50) / 1000;
    if (!this.started || this.raceOver) {
      this.drawWorld(dt);
      return;
    }
    if (this.pitOpen) {
      this.drawWorld(0);
      return;
    }
    this.elapsed += dt;
    const input = this.bridge.input;

    // speed
    const reading = this.active?.challenge.kind === 'gate';
    let target = reading ? CRUISE : TOP;
    if (time < this.boostUntil && !reading) target = TURBO;
    if (time < this.slowUntil) target = SLOW;
    const rate = target > this.speed ? 260 : 900;
    this.speed += Phaser.Math.Clamp(target - this.speed, -rate * dt, rate * dt);
    this.dist += this.speed * dt;

    // steering
    let vy = 0;
    if (input.isDown('up')) vy -= STEER;
    if (input.isDown('down')) vy += STEER;
    if (vy !== 0) this.targetLane = null;
    if (this.targetLane !== null) {
      const d = this.laneY(this.targetLane) - this.carY;
      vy = Math.sign(d) * Math.min(Math.abs(d) * 8, STEER);
    }
    const minY = this.roadTop + this.laneH * 0.4;
    const maxY = this.roadBottom - this.laneH * 0.4;
    this.carY = Phaser.Math.Clamp(this.carY + vy * dt, minY, maxY);
    this.car.setPosition(this.carX, this.carY + (this.motion ? Math.sin(time / 60) * 1.5 : 0));
    this.car.setAngle(vy / 60);
    const boosting = time < this.boostUntil && !reading;
    this.trail.setPosition(this.carX - this.car.displayWidth * 0.7, this.carY + 6).setAlpha(boosting ? 0.95 : 0);

    // challenges
    for (const s of this.stops) {
      if (s.done) continue;
      if (!s.announced && !this.active && this.dist >= s.dist - s.readDist) this.announce(s);
      if (s === this.active) {
        if (s.challenge.kind === 'gate') {
          if (this.dist >= s.dist) this.resolveGate(s);
          else {
            this.timerTick += dt;
            if (this.timerTick > 0.1) {
              this.timerTick = 0;
              this.bridge.hud.set({ timer: Phaser.Math.Clamp((s.dist - this.dist) / s.readDist, 0, 1) });
            }
          }
        } else if (this.dist >= s.dist) {
          this.dist = s.dist;
          this.openPit(s);
        }
      }
    }

    // rivals (they pit too, so they freeze during pit stops)
    const pace = reading ? CRUISE : TOP;
    for (const r of this.rivals) {
      r.dist += pace * r.factor * dt;
      if (Math.random() < 0.004) r.lane = Phaser.Math.Clamp(r.lane + (Math.random() < 0.5 ? -1 : 1), 0, 2);
      r.y = Phaser.Math.Linear(r.y, this.laneY(r.lane), 0.04);
    }

    // obstacles
    for (const o of this.obstacles) {
      if (o.hit) continue;
      const sx = this.screenX(o.dist);
      if (Math.abs(sx - this.carX) < this.car.displayWidth * 0.45 && Math.abs(this.laneY(o.lane) - this.carY) < this.laneH * 0.55) {
        o.hit = true;
        this.slowUntil = time + 700;
        this.bridge.audio.sfx('crash');
        this.shake(0.008, 180);
        const puff = this.add.image(sx, this.laneY(o.lane), 'tr-smoke').setDepth(25).setScale(0.6);
        this.tweens.add({ targets: puff, alpha: 0, scale: 1.2, duration: 600, onComplete: () => puff.destroy() });
        this.tweens.add({ targets: o.img, angle: 200, alpha: 0, x: o.img.x + 80, duration: 500 });
      }
    }

    // finish
    if (this.dist >= this.finishDist) this.crossFinish();

    this.statTick += dt;
    if (this.statTick > 0.25) {
      this.statTick = 0;
      this.bridge.hud.set({ stat: { label: 'POS', value: `${this.position()}/4` } });
    }
    this.drawWorld(dt);
  }

  private position() {
    return 1 + this.rivals.filter((r) => r.dist > this.dist).length;
  }

  private drawWorld(dt: number) {
    const shift = this.speed * dt;
    for (const b of this.barriers) b.tilePositionX += shift / b.tileScaleX;
    for (const r of this.rivals) {
      const sx = this.screenX(r.dist);
      r.img.setVisible(sx > -200 && sx < this.W + 200).setPosition(sx, r.y);
    }
    for (const o of this.obstacles) if (!o.hit) o.img.setX(this.screenX(o.dist));
    for (const s of this.stops) if (s.gfx) s.gfx.setX(this.screenX(s.dist));
    if (this.finishGfx) this.finishGfx.setX(this.screenX(this.finishDist));
    else if (this.finishDist - this.dist < this.W) {
      this.finishGfx = this.add.image(this.screenX(this.finishDist), (this.roadTop + this.roadBottom) / 2, 'tr-finish').setDepth(17);
      this.finishGfx.setScale((this.roadBottom - this.roadTop + 40) / this.finishGfx.height);
    }
  }

  private finishGfx: Phaser.GameObjects.Image | null = null;

  private crossFinish() {
    if (this.raceOver) return;
    this.raceOver = true;
    const pos = this.position();
    const bonus = [300, 200, 100, 0][pos - 1] ?? 0;
    if (bonus) this.bonus(bonus, { x: this.carX + 100, y: this.carY - 90 }, `${pos === 1 ? '1st' : pos === 2 ? '2nd' : '3rd'} place `);
    this.bridge.audio.sfx('win');
    this.setPrompt({ kicker: 'Finish!', text: pos === 1 ? 'You won the race!' : `You finished in position ${pos}.` });
    this.banner(pos === 1 ? 'YOU WIN!' : `FINISH! #${pos}`, COLORS.yellow, 1600);
    this.tweens.add({ targets: this, speed: 0, duration: 1200 });
    this.time.delayedCall(1900, () => this.finishGame({ position: pos, racers: 4, seconds: Math.round(this.elapsed) }));
  }
}
