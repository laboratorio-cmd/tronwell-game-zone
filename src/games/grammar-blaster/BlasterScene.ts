import Phaser from 'phaser';
import { filledSentence, type PreparedChoice } from '../../education/questionEngine';
import { BaseScene, FONT, textStyle } from '../shared/BaseScene';
import { digitIndex } from '../shared/input';
import { preloadAssets } from '../shared/pixel/manifest';
import { COLORS } from '../shared/pixel/palette';
import type { BlasterContent } from './definition';

interface Rock {
  box: Phaser.GameObjects.Container;
  rockImg: Phaser.GameObjects.Image;
  glow: Phaser.GameObjects.Graphics;
  index: number;
  label: string;
  correct: boolean;
  alive: boolean;
  baseX: number;
  y: number;
  phase: number;
  hitW: number;
  hitH: number;
  spin: number;
}

interface Bolt {
  obj: Phaser.GameObjects.Image;
  vx: number;
  vy: number;
  target: Rock | null;
}

interface Mine {
  sprite: Phaser.GameObjects.Image;
  baseX: number;
  y: number;
  vy: number;
  phase: number;
}

const SHIP_SPEED = 560;
const BOLT_SPEED = 1150;
const FIRE_COOLDOWN = 230;
const MAX_SHIELDS = 3;
const ROCKS = ['gb-rock-lava', 'gb-rock-blue', 'gb-rock-dark'];
const ENEMIES = ['gb-enemy-1', 'gb-enemy-2', 'gb-enemy-3', 'gb-enemy-4'];
const BACKGROUNDS = [1, 2, 3, 4, 5].map((n) => `bg-grammar-blaster-${n}`);
const ASSET_KEYS = ['gb-ship', 'gb-ship-2', ...ROCKS, ...ENEMIES, 'gb-laser', 'gb-laser-gold', 'gb-boom', 'gb-blast', 'gb-explosion'];

export class BlasterScene extends BaseScene<BlasterContent, null> {
  private ship!: Phaser.GameObjects.Sprite;
  private shipY = 0;
  private dragX: number | null = null;
  private stars: { r: Phaser.GameObjects.Rectangle; speed: number }[] = [];
  private rocks: Rock[] = [];
  private bolts: Bolt[] = [];
  private mines: Mine[] = [];
  private waveIndex = -1;
  private waveActive = false;
  private answered = false;
  private resolved = false;
  private waveElapsed = 0;
  private fallTime = 10;
  private limitY = 0;
  private lastFire = 0;
  private shields = MAX_SHIELDS;
  private repairUntil = 0;
  private invulnerableUntil = 0;
  private mineTimer = 0;
  private timerTick = 0;

  private get waves(): PreparedChoice[] {
    return this.bridge.content.waves;
  }

  private get bgKey() {
    return BACKGROUNDS[Math.max(0, this.levelIndex)];
  }

  preload() {
    preloadAssets(this, [...ASSET_KEYS, this.bgKey]);
  }

  create() {
    this.makeTextures([...ASSET_KEYS, this.bgKey]);
    this.crisp(...ROCKS, this.bgKey);
    this.backdrop(this.bgKey, { dim: 0.52 });
    this.stars = this.makeStars(70);

    this.shipY = this.H - (this.H > this.W ? 120 : 70);
    this.limitY = this.shipY - 130;
    this.ship = this.add.sprite(this.W / 2, this.shipY, 'gb-ship').setScale(0.9).setDepth(50);
    if (!this.anims.exists('ship-fly')) this.anims.create({ key: 'ship-fly', frames: [{ key: 'gb-ship' }, { key: 'gb-ship-2' }], frameRate: 10, repeat: -1 });
    this.ship.play('ship-fly');

    this.bridge.hud.set({ lives: { current: this.shields, max: MAX_SHIELDS }, progressTotal: this.waves.length });

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      const rock = this.rockAt(p.worldX, p.worldY);
      if (rock) this.lockOn(rock);
      else if (p.worldY > this.H * 0.45) this.dragX = p.worldX;
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (p.isDown && this.dragX !== null) this.dragX = p.worldX;
    });
    this.input.on('pointerup', () => (this.dragX = null));
    this.onCleanup(
      this.bridge.input.onKey((code) => {
        const i = digitIndex(code);
        if (i === null) return;
        const rock = this.rocks.find((r) => r.alive && r.index === i);
        if (rock) this.lockOn(rock);
      }),
    );

    this.banner('GET READY', COLORS.cyan, 900);
    this.time.delayedCall(1100, () => this.startWave(0));
  }

  /* ---------------- waves ---------------- */

  private startWave(i: number) {
    if (i >= this.waves.length) {
      this.endMission();
      return;
    }
    this.waveIndex = i;
    const w = this.waves[i];
    this.answered = false;
    this.resolved = false;
    this.waveActive = true;
    this.waveElapsed = 0;
    this.fallTime = Phaser.Math.Clamp(8 + w.item.prompt.length / 14, 9, 15);
    this.bridge.hud.set({
      prompt: { kicker: this.touch ? 'Tap or shoot the asteroid that fills the gap' : `Shoot the answer · press 1–${w.options.length} to lock on`, text: w.item.prompt },
      progressLabel: `Wave ${i + 1}/${this.waves.length}`,
      progressDone: i,
      feedback: null,
      timer: 1,
    });
    this.spawnRocks(w);
  }

  private spawnRocks(w: PreparedChoice) {
    const n = w.options.length;
    const margin = 40;
    const laneW = (this.W - margin * 2) / n;
    const measure = this.add.text(0, 0, '', textStyle(32)).setVisible(false);
    const widest = Math.max(...w.options.map((o) => measure.setText(o).width));
    measure.destroy();
    let size = Phaser.Math.Clamp(Math.floor((32 * (laneW - 34)) / widest), 20, 34);
    const stagger = (widest * size) / 32 > laneW - 20;
    if (stagger) size = Phaser.Math.Clamp(Math.floor((32 * (laneW * 1.7 - 34)) / widest), 20, 30);

    w.options.forEach((label, index) => {
      const x = margin + laneW * (index + 0.5);
      const y = -90 - (stagger && index % 2 ? 190 : 0);
      const rockImg = this.add.image(0, 0, ROCKS[index % ROCKS.length]);
      rockImg.setScale(150 / Math.max(rockImg.width, rockImg.height));
      const glow = this.add.graphics();
      const text = this.add.text(0, 6, label, textStyle(size, COLORS.text)).setOrigin(0.5);
      const pillW = text.width + 26;
      const pillH = text.height + 10;
      const pill = this.add.graphics();
      pill.fillStyle(0x10172f, 0.88).fillRoundedRect(-pillW / 2, 6 - pillH / 2, pillW, pillH, 10);
      pill.lineStyle(3, 0x39d9ff, 1).strokeRoundedRect(-pillW / 2, 6 - pillH / 2, pillW, pillH, 10);
      const badge = this.add.text(-pillW / 2 + 2, 6 - pillH / 2 - 18, String(index + 1), {
        fontFamily: FONT, fontStyle: '900', fontSize: '20px', color: '#10172F', backgroundColor: '#FFD166', padding: { x: 7, y: 1 },
      }).setOrigin(0.5);
      const box = this.add.container(x, y, [glow, rockImg, pill, text, badge]).setDepth(20);
      this.rocks.push({
        box, rockImg, glow, index, label, correct: index === w.correctIndex, alive: true, baseX: x, y,
        phase: Math.random() * Math.PI * 2, hitW: Math.max(160, pillW + 10), hitH: 170, spin: (Math.random() - 0.5) * 0.6,
      });
    });
  }

  private rockAt(x: number, y: number) {
    return this.rocks.find((r) => r.alive && Math.abs(x - r.box.x) < r.hitW / 2 && Math.abs(y - r.box.y) < r.hitH / 2) ?? null;
  }

  private hitRock(rock: Rock) {
    if (!rock.alive || this.resolved) return;
    const w = this.waves[this.waveIndex];
    const item = w.item;
    const sentence = filledSentence(item);
    const base = { itemId: item.id, category: item.category, difficulty: item.difficulty, prompt: item.prompt, expected: w.options[w.correctIndex], feedback: item.feedback, given: rock.label };

    if (rock.correct) {
      if (!this.answered) {
        this.answered = true;
        this.answer({ ...base, correct: true }, { x: rock.box.x, y: rock.box.y - 40 });
        this.feedback('correct', 'Correct!', item.feedback, sentence);
        if (this.waveElapsed < this.fallTime * 0.45) this.bonus(50, { x: rock.box.x, y: rock.box.y - 90 }, 'Quick shot ');
      } else {
        this.bridge.audio.sfx('explode');
      }
      this.destroyRock(rock, true);
      this.resolveWave(this.answeredCorrectly() ? 1500 : 2600);
    } else {
      if (!this.answered) {
        this.answered = true;
        this.answer({ ...base, correct: false });
        this.feedback('wrong', `Not “${rock.label}”`, item.feedback, sentence);
        this.floatText(rock.box.x, rock.box.y - 40, '✗', COLORS.bad, 44);
      }
      this.destroyRock(rock, false);
      const good = this.rocks.find((r) => r.alive && r.correct);
      if (good) this.highlight(good);
    }
  }

  private answeredCorrectly() {
    const last = this.bridge.keeper.answers[this.bridge.keeper.answers.length - 1];
    return !!last && last.itemId === this.waves[this.waveIndex].item.id && last.correct;
  }

  private highlight(rock: Rock) {
    rock.glow.clear();
    rock.glow.lineStyle(6, 0xffd166, 1).strokeCircle(0, 0, 96);
    this.tweens.add({ targets: rock.glow, alpha: 0.3, yoyo: true, repeat: -1, duration: 350 });
  }

  private destroyRock(rock: Rock, good: boolean) {
    rock.alive = false;
    const { x, y } = rock.box;
    this.burst(x, y, good ? [COLORS.yellow, COLORS.orange, COLORS.text] : ['#6B7699', '#B7C1DF', COLORS.bad], good ? 26 : 14);
    this.explosion(x, y, good ? 'gb-boom' : 'gb-blast', good ? 2 : 1.2);
    this.bridge.audio.sfx(good ? 'explode' : 'hit');
    this.tweens.add({ targets: rock.box, scale: good ? 1.4 : 0.6, alpha: 0, duration: 260, onComplete: () => rock.box.destroy() });
  }

  private resolveWave(delay: number) {
    if (this.resolved) return;
    this.resolved = true;
    this.bridge.hud.set({ timer: null, progressDone: this.waveIndex + 1 });
    for (const r of this.rocks) {
      if (!r.alive) continue;
      r.alive = false;
      this.tweens.add({ targets: r.box, alpha: 0, y: r.box.y - 40, duration: 400, onComplete: () => r.box.destroy() });
    }
    this.time.delayedCall(delay, () => {
      this.rocks = [];
      this.waveActive = false;
      this.startWave(this.waveIndex + 1);
    });
  }

  private missed() {
    const w = this.waves[this.waveIndex];
    if (!this.answered) {
      this.answered = true;
      this.answer({
        itemId: w.item.id, correct: false, category: w.item.category, difficulty: w.item.difficulty, prompt: w.item.prompt,
        expected: w.options[w.correctIndex], given: '(no answer)', feedback: w.item.feedback,
      });
      this.feedback('wrong', 'Too slow!', w.item.feedback, filledSentence(w.item));
    }
    this.resolveWave(2800);
  }

  private endMission() {
    this.waveActive = false;
    this.bridge.hud.set({ prompt: null, timer: null, progressDone: this.waves.length });
    this.bridge.audio.sfx('win');
    this.banner('MISSION COMPLETE', COLORS.yellow, 1500);
    this.time.delayedCall(1700, () => this.finishGame({ waves: this.waves.length }));
  }

  /* ---------------- shooting ---------------- */

  private canFire(now: number) {
    return now > this.repairUntil && now - this.lastFire > FIRE_COOLDOWN;
  }

  private fire(target: Rock | null) {
    const now = this.time.now;
    if (!this.canFire(now)) return;
    this.lastFire = now;
    const obj = this.add.image(this.ship.x, this.shipY - 60, target ? 'gb-laser-gold' : 'gb-laser').setScale(0.45).setDepth(40);
    this.bolts.push({ obj, vx: 0, vy: -BOLT_SPEED, target });
    this.bridge.audio.sfx('shoot');
  }

  private lockOn(rock: Rock) {
    if (!rock.alive || this.time.now < this.repairUntil) return;
    this.dragX = null;
    this.fire(rock);
  }

  /* ---------------- loop ---------------- */

  update(_time: number, deltaMs: number) {
    const dt = Math.min(deltaMs, 50) / 1000;
    const now = this.time.now;
    const input = this.bridge.input;

    for (const s of this.stars) {
      s.r.y += s.speed * dt * (this.motion ? 1 : 0.3);
      if (s.r.y > this.H) {
        s.r.y = -4;
        s.r.x = Math.random() * this.W;
      }
    }

    // ship
    let vx = 0;
    if (input.isDown('left')) vx -= SHIP_SPEED;
    if (input.isDown('right')) vx += SHIP_SPEED;
    if (vx !== 0) this.dragX = null;
    if (this.dragX !== null) {
      const d = this.dragX - this.ship.x;
      vx = Math.sign(d) * Math.min(Math.abs(d) * 10, 900);
    }
    this.ship.x = Phaser.Math.Clamp(this.ship.x + vx * dt, 40, this.W - 40);
    this.ship.setAngle(Phaser.Math.Linear(this.ship.angle, vx / 70, 0.2));
    const repairing = now < this.repairUntil;
    this.ship.setTint(repairing ? 0x6b7699 : 0xffffff);
    this.ship.setAlpha(now < this.invulnerableUntil && Math.floor(now / 90) % 2 ? 0.4 : 1);
    if (input.consume('action') || (input.isDown('action') && now - this.lastFire > FIRE_COOLDOWN * 1.6)) this.fire(null);

    // bolts
    for (const b of this.bolts) {
      if (b.target?.alive) {
        const dx = b.target.box.x - b.obj.x;
        const dy = b.target.box.y - b.obj.y;
        const d = Math.hypot(dx, dy) || 1;
        b.vx = (dx / d) * BOLT_SPEED;
        b.vy = (dy / d) * BOLT_SPEED;
        b.obj.setRotation(Math.atan2(dy, dx) + Math.PI / 2);
      }
      b.obj.x += b.vx * dt;
      b.obj.y += b.vy * dt;
    }
    for (const b of [...this.bolts]) {
      let hit = false;
      const rock = this.rockAt(b.obj.x, b.obj.y);
      if (rock) {
        this.hitRock(rock);
        hit = true;
      } else {
        const mine = this.mines.find((m) => Math.hypot(m.sprite.x - b.obj.x, m.sprite.y - b.obj.y) < 34);
        if (mine) {
          this.killMine(mine, true);
          hit = true;
        }
      }
      if (hit || b.obj.y < -60 || b.obj.y > this.H + 60) {
        b.obj.destroy();
        this.bolts.splice(this.bolts.indexOf(b), 1);
      }
    }

    // rocks
    if (this.waveActive && !this.resolved) {
      this.waveElapsed += dt;
      const span = this.limitY + 90;
      const speed = span / this.fallTime;
      for (const r of this.rocks) {
        if (!r.alive) continue;
        r.y += speed * dt;
        r.phase += dt * 1.2;
        r.box.setPosition(r.baseX + (this.motion ? Math.sin(r.phase) * 10 : 0), r.y);
        r.rockImg.rotation += r.spin * dt;
      }
      const good = this.rocks.find((r) => r.correct && r.alive);
      if (good && good.y > this.limitY) this.missed();
      else if (!good && this.answered === false && this.rocks.every((r) => !r.alive)) this.missed();
      this.timerTick += dt;
      if (this.timerTick > 0.1 && good) {
        this.timerTick = 0;
        this.bridge.hud.set({ timer: Phaser.Math.Clamp(1 - (good.y + 90) / span, 0, 1) });
      }
    }

    // mines
    this.mineTimer -= dt;
    if (this.waveActive && this.mineTimer <= 0) {
      this.mineTimer = Phaser.Math.FloatBetween(4.5, 7.5);
      this.spawnMine();
    }
    for (const m of [...this.mines]) {
      m.y += m.vy * dt;
      m.phase += dt * 2;
      m.sprite.setPosition(m.baseX + Math.sin(m.phase) * 60, m.y);
      if (m.y > this.H + 40) {
        m.sprite.destroy();
        this.mines.splice(this.mines.indexOf(m), 1);
      } else if (now > this.invulnerableUntil && Math.hypot(m.sprite.x - this.ship.x, m.sprite.y - this.shipY) < 52) {
        this.killMine(m, false);
        this.shipHit();
      }
    }
  }

  private spawnMine() {
    const x = Phaser.Math.Between(80, this.W - 80);
    const sprite = this.add.image(x, -30, ENEMIES[Phaser.Math.Between(0, ENEMIES.length - 1)]).setScale(0.75).setDepth(30);
    this.mines.push({ sprite, baseX: x, y: -30, vy: Phaser.Math.Between(140, 200), phase: Math.random() * 6 });
  }

  private killMine(m: Mine, byPlayer: boolean) {
    this.burst(m.sprite.x, m.sprite.y, [COLORS.bad, COLORS.orange, '#6B7699'], 16);
    this.explosion(m.sprite.x, m.sprite.y, 'gb-explosion', 1.1);
    this.bridge.audio.sfx('hit');
    if (byPlayer) this.bonus(25, { x: m.sprite.x, y: m.sprite.y - 30 });
    m.sprite.destroy();
    this.mines.splice(this.mines.indexOf(m), 1);
  }

  private explosion(x: number, y: number, key: string, scale: number) {
    const e = this.add.image(x, y, key).setScale(scale * 0.4).setDepth(950);
    this.tweens.add({ targets: e, scale, alpha: 0, duration: 450, ease: 'Cubic.easeOut', onComplete: () => e.destroy() });
  }

  private shipHit() {
    this.shields -= 1;
    this.invulnerableUntil = this.time.now + 1500;
    this.shake(0.01, 220);
    this.bridge.audio.sfx('crash');
    if (this.shields <= 0) {
      this.repairUntil = this.time.now + 2000;
      this.floatText(this.ship.x, this.shipY - 70, 'Repairing…', COLORS.orange, 26);
      this.time.delayedCall(2000, () => {
        this.shields = MAX_SHIELDS;
        this.bridge.hud.set({ lives: { current: this.shields, max: MAX_SHIELDS } });
      });
    }
    this.bridge.hud.set({ lives: { current: Math.max(0, this.shields), max: MAX_SHIELDS } });
  }
}
