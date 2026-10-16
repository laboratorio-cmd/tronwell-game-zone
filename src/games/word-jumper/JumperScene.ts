import Phaser from 'phaser';
import { seededRng } from '../../education/questionEngine';
import { BaseScene, FONT, textStyle } from '../shared/BaseScene';
import { preloadAssets } from '../shared/pixel/manifest';
import { COLORS } from '../shared/pixel/palette';
import type { JumperContent, JumperMission } from './definition';
import { GROUND_Y, LEVEL_H, TILE, buildLevel, type LevelLayout } from './levelGen';
import { nextLetterState, startSpelling, type SpellState } from './spelling';

const RUN = ['wj-run-1', 'wj-run-2', 'wj-run-3', 'wj-run-4'];
const ENEMIES = ['wj-robot', 'wj-crab', 'wj-alien'];
const BACKGROUNDS = [1, 6, 2, 3, 4].map((n) => `bg-word-jumper-${n}`);
const ASSET_KEYS = [...RUN, 'wj-idle', 'wj-jump', 'wj-ground', 'wj-rock', 'wj-flag', 'wj-ufo', 'wj-coin', 'wj-gem-green', 'wj-gem-purple', 'wj-spikes', ...ENEMIES];

const GRAVITY = 1900;
const RUN_SPEED = 300;
const JUMP_V = 780;
const BODY_W = 34;
const BODY_H = 66;

interface Pickup {
  box: Phaser.GameObjects.Container;
  mission: number;
  text: string;
  correct: boolean;
  w: number;
  h: number;
  alive: boolean;
  cooldownUntil: number;
}

interface Enemy {
  img: Phaser.GameObjects.Image;
  x1: number;
  x2: number;
  dir: number;
}

export class JumperScene extends BaseScene<JumperContent, null> {
  private L!: LevelLayout;
  private body!: Phaser.Physics.Arcade.Body;
  private bodyZone!: Phaser.GameObjects.Zone;
  private hero!: Phaser.GameObjects.Sprite;
  private pickups: Pickup[] = [];
  private coins: Phaser.GameObjects.Image[] = [];
  private enemies: Enemy[] = [];
  private spikeZones: Phaser.Geom.Rectangle[] = [];
  private gates: { zone: Phaser.GameObjects.Zone; fx: Phaser.GameObjects.Graphics; open: boolean }[] = [];
  private flags: Phaser.GameObjects.Image[] = [];
  private stars: { r: Phaser.GameObjects.Rectangle; speed: number }[] = [];
  private mission = 0;
  private found = 0;
  private spell: SpellState | null = null;
  private respawnX = 0;
  private invulnerableUntil = 0;
  private coyote = 0;
  private jumpBuffer = 0;
  private runFrame = 0;
  private runTimer = 0;
  private facing = 1;
  private gateHintAt = 0;
  private exiting = false;
  private viewTop = 0;

  private get missions(): JumperMission[] {
    return this.bridge.content.missions;
  }

  private get bgKey() {
    return BACKGROUNDS[Math.max(0, this.levelIndex)];
  }

  preload() {
    preloadAssets(this, [...ASSET_KEYS, this.bgKey]);
  }

  create() {
    this.makeTextures([...ASSET_KEYS, this.bgKey]);
    this.crisp(this.bgKey);
    const iconKeys = new Set<string>();
    for (const m of this.missions) {
      if (m.kind === 'spell' && m.icon) iconKeys.add(m.icon);
      if (m.kind === 'category') m.words.forEach((w) => w.icon && iconKeys.add(w.icon));
    }
    this.makeTextures([...iconKeys]);

    // Level: one segment per mission. Wide words need wider chunks.
    const counts = this.missions.map((m) => (m.kind === 'category' ? m.words.length : m.letters.length));
    const minTiles = this.missions.map((m) => (m.kind === 'category' ? Math.ceil((Math.max(...m.words.map((w) => w.text.length)) * 14 + 90) / TILE) : 4));
    this.L = buildLevel(counts, minTiles, seededRng(Math.floor(Math.random() * 1e9)));

    this.viewTop = Math.min(0, LEVEL_H - this.H);
    this.backdrop(this.bgKey, { dim: 0.42 });
    this.stars = this.makeStars(40);
    this.stars.forEach((st) => st.r.setScrollFactor(0));

    this.physics.world.setBounds(0, this.viewTop - 400, this.L.width, LEVEL_H - this.viewTop + 800);
    this.cameras.main.setBounds(0, this.viewTop, this.L.width, LEVEL_H - this.viewTop);

    this.buildTerrain();
    this.buildPickups();
    this.buildActors();

    // Player: an invisible physics box with the astronaut drawn on top (frames differ in size).
    this.respawnX = this.L.checkpoints[0];
    this.bodyZone = this.add.zone(this.respawnX, GROUND_Y - BODY_H / 2 - 4, BODY_W, BODY_H);
    this.physics.add.existing(this.bodyZone);
    this.body = this.bodyZone.body as Phaser.Physics.Arcade.Body;
    this.body.setGravityY(GRAVITY).setMaxVelocityY(950).setCollideWorldBounds(false);
    this.hero = this.add.sprite(0, 0, 'wj-idle').setOrigin(0.5, 1).setScale(0.72).setDepth(50);
    this.physics.add.collider(this.bodyZone, this.solidGroup);
    for (const g of this.gates) this.physics.add.collider(this.bodyZone, g.zone);
    this.cameras.main.startFollow(this.bodyZone, true, 0.12, 0.12, 0, 60);

    this.startMission(0);
    this.banner('GO!', COLORS.good, 700);
  }

  /* ---------------- building ---------------- */

  private solidGroup!: Phaser.Physics.Arcade.StaticGroup;

  private buildTerrain() {
    this.solidGroup = this.physics.add.staticGroup();
    for (const s of this.L.solids) {
      const x = s.x * TILE;
      const y = s.y * TILE;
      const w = s.w * TILE;
      const h = Math.min(s.h, 1) * TILE;
      const zone = this.add.zone(x + w / 2, y + h / 2, w, h);
      this.solidGroup.add(zone);
      const ground = s.h > 1;
      const key = ground ? 'wj-ground' : 'wj-rock';
      const src = this.textures.get(key).getSourceImage();
      const scale = (ground ? 62 : 54) / src.height;
      this.add
        .tileSprite(x, y - 4, w, src.height * scale, key)
        .setOrigin(0, 0)
        .setTileScale(scale, scale)
        .setDepth(10);
    }
    for (const sp of this.L.spikes) {
      const x = sp.x * TILE;
      const w = sp.w * TILE;
      const img = this.add.image(x + w / 2, GROUND_Y + 6, 'wj-spikes').setOrigin(0.5, 1).setDepth(12);
      img.setScale(w / img.width);
      this.spikeZones.push(new Phaser.Geom.Rectangle(x + 6, GROUND_Y - 30, w - 12, 30));
    }
    this.L.gates.forEach((gx) => {
      const zone = this.add.zone(gx, (this.viewTop + GROUND_Y) / 2, 26, GROUND_Y - this.viewTop);
      this.physics.add.existing(zone, true);
      const fx = this.add.graphics().setDepth(30);
      this.gates.push({ zone, fx, open: false });
    });
    this.L.checkpoints.forEach((cx, i) => {
      const flag = this.add.image(cx - 30, GROUND_Y - 2, 'wj-flag').setOrigin(0.5, 1).setScale(0.55).setDepth(15);
      if (i > 0) flag.setTint(0x6b7699);
      this.flags.push(flag);
    });
    // exit: the UFO beams the astronaut up
    const ufoY = GROUND_Y - 300;
    const beam = this.add.graphics().setDepth(14);
    beam.fillStyle(0x39d9ff, 0.18).fillTriangle(this.L.portalX, ufoY + 20, this.L.portalX - 90, GROUND_Y, this.L.portalX + 90, GROUND_Y);
    const ufo = this.add.image(this.L.portalX, ufoY, 'wj-ufo').setScale(1.3).setDepth(16);
    if (this.motion) this.tweens.add({ targets: [ufo], y: ufoY - 12, yoyo: true, repeat: -1, duration: 1200, ease: 'Sine.easeInOut' });
    this.add.text(this.L.portalX, ufoY - 80, 'EXIT', textStyle(26, COLORS.cyan)).setOrigin(0.5).setDepth(16);
  }

  private buildPickups() {
    this.missions.forEach((m, mi) => {
      const spots = this.L.spots[mi];
      if (m.kind === 'category') {
        m.words.forEach((w, i) => this.addWordCrystal(mi, w.text, w.correct, w.icon, spots[i]));
      } else {
        m.letters.forEach((ch, i) => this.addLetterBlock(mi, ch, spots[i]));
      }
    });
    for (const c of this.L.coins) {
      const coin = this.add.image(c.x, c.y, 'wj-coin').setScale(0.5).setDepth(20);
      if (this.motion) this.tweens.add({ targets: coin, scaleX: 0.15, yoyo: true, repeat: -1, duration: 500 });
      this.coins.push(coin);
    }
  }

  private addWordCrystal(mission: number, text: string, correct: boolean, icon: string | null, at: { x: number; y: number }) {
    const label = this.add.text(0, 0, text, textStyle(24, COLORS.text)).setOrigin(0, 0.5);
    const iconImg = icon
      ? this.add.image(0, 0, icon).setScale(3)
      : this.add.image(0, 0, mission % 2 ? 'wj-gem-purple' : 'wj-gem-green').setScale(0.5);
    const iconW = 36;
    const w = iconW + label.width + 30;
    const h = 50;
    const g = this.add.graphics();
    g.fillStyle(0x10172f, 0.9).fillRoundedRect(-w / 2, -h / 2, w, h, 12);
    g.lineStyle(3, 0x39d9ff, 1).strokeRoundedRect(-w / 2, -h / 2, w, h, 12);
    iconImg.setPosition(-w / 2 + 12 + iconW / 2, 0);
    label.setPosition(-w / 2 + 18 + iconW, 0);
    const box = this.add.container(at.x, at.y, [g, iconImg, label]).setDepth(25);
    if (this.motion) this.tweens.add({ targets: box, y: at.y - 8, yoyo: true, repeat: -1, duration: 900 + Math.random() * 400, ease: 'Sine.easeInOut' });
    this.pickups.push({ box, mission, text, correct, w, h, alive: true, cooldownUntil: 0 });
  }

  private addLetterBlock(mission: number, ch: string, at: { x: number; y: number }) {
    const s = 54;
    const g = this.add.graphics();
    g.fillStyle(0x0b1024, 1).fillRoundedRect(-s / 2 - 3, -s / 2 - 3, s + 6, s + 6, 10);
    g.fillStyle(0xff9f43, 1).fillRoundedRect(-s / 2, -s / 2, s, s, 8);
    g.fillStyle(0xffd166, 1).fillRect(-s / 2 + 5, -s / 2 + 4, s - 10, 5);
    g.fillStyle(0xc46a1c, 1).fillRect(-s / 2 + 5, s / 2 - 8, s - 10, 4);
    const t = this.add.text(0, 2, ch, { fontFamily: FONT, fontStyle: '900', fontSize: '34px', color: '#39D9FF', stroke: '#0B1024', strokeThickness: 6 }).setOrigin(0.5);
    const box = this.add.container(at.x, at.y, [g, t]).setDepth(25);
    if (this.motion) this.tweens.add({ targets: box, y: at.y - 6, yoyo: true, repeat: -1, duration: 800 + Math.random() * 400, ease: 'Sine.easeInOut' });
    this.pickups.push({ box, mission, text: ch, correct: true, w: s, h: s, alive: true, cooldownUntil: 0 });
  }

  private buildActors() {
    this.L.drones.forEach((d, i) => {
      const key = ENEMIES[i % ENEMIES.length];
      const img = this.add.image(d.x1, GROUND_Y + 2, key).setOrigin(0.5, 1).setDepth(26);
      img.setScale(64 / img.height);
      this.enemies.push({ img, x1: d.x1, x2: d.x2, dir: 1 });
    });
  }

  /* ---------------- missions ---------------- */

  private startMission(i: number) {
    this.mission = i;
    this.found = 0;
    const m = this.missions[i];
    const n = this.missions.length;
    if (m.kind === 'category') {
      this.spell = null;
      this.setPrompt({ kicker: `Mission ${i + 1}/${n} · collect the right words, jump over the others`, text: m.item.prompt });
      this.bridge.hud.set({ stat: { label: 'FOUND', value: `0/${m.item.correct.length}` } });
    } else {
      this.spell = startSpelling(m.item.word);
      this.setPrompt({ kicker: `Mission ${i + 1}/${n} · spell the word letter by letter`, text: m.item.clue, icon: m.icon, slots: { letters: this.spell.filled, next: 0 } });
      this.bridge.hud.set({ stat: { label: 'LETTERS', value: `0/${m.item.word.length}` } });
    }
    this.bridge.hud.set({ progressLabel: `Mission ${i + 1}/${n}`, progressDone: i });
  }

  private collect(p: Pickup) {
    const m = this.missions[p.mission];
    const at = { x: p.box.x, y: p.box.y - 40 };
    if (m.kind === 'category') {
      const item = m.item;
      p.alive = false;
      const base = { itemId: `${item.id}#${p.text}`, category: item.category, difficulty: item.difficulty, prompt: `${item.prompt}: “${p.text}”?`, given: p.text, feedback: item.feedback };
      if (p.correct) {
        this.answer({ ...base, correct: true, expected: `Yes — “${p.text}” belongs.` }, at);
        this.found++;
        this.feedback('correct', `“${p.text}” ✓`, `${this.found} of ${item.correct.length} found.`);
        this.bridge.hud.set({ stat: { label: 'FOUND', value: `${this.found}/${item.correct.length}` } });
        this.pop(p, true);
        if (this.found >= item.correct.length) this.completeMission(item.feedback);
      } else {
        this.answer({ ...base, correct: false, expected: `No — it doesn't belong. Correct words: ${item.correct.join(', ')}` });
        this.feedback('wrong', `“${p.text}” doesn't belong.`, item.feedback);
        this.pop(p, false);
      }
      return;
    }

    // spelling
    const s = this.spell;
    if (!s) return;
    const step = nextLetterState(s, p.text);
    if (step.result === 'placed') {
      p.alive = false;
      this.spell = step.state;
      this.bonus(20, at);
      this.bridge.audio.sfx('coin');
      this.pop(p, true);
      this.setPrompt({ kicker: `Mission ${p.mission + 1}/${this.missions.length} · spell the word letter by letter`, text: m.item.clue, icon: m.icon, slots: { letters: step.state.filled, next: step.state.next } });
      this.bridge.hud.set({ stat: { label: 'LETTERS', value: `${step.state.next}/${s.word.length}` } });
      if (step.done) {
        const perfect = step.state.mistakes === 0;
        this.answer(
          { itemId: m.item.id, correct: perfect, category: m.item.category, difficulty: m.item.difficulty, prompt: m.item.clue, given: perfect ? m.item.word : 'spelled with mistakes', expected: m.item.word, feedback: m.item.feedback },
          at,
        );
        this.completeMission(m.item.feedback, perfect ? 'Perfect spelling!' : 'Word complete!', m.item.word);
      }
    } else if (step.result === 'later') {
      p.cooldownUntil = this.time.now + 900;
      this.spell = step.state;
      this.body.setVelocityX(-this.facing * 260);
      this.bridge.audio.sfx('wrong');
      this.feedback('info', `Not yet!`, `“${p.text}” comes later in the word. Which letter is next?`);
    } else {
      p.alive = false;
      this.spell = step.state;
      this.bridge.audio.sfx('wrong');
      this.feedback('wrong', `No “${p.text}” in this word.`, 'Look at the clue again and find the next letter.');
      this.pop(p, false);
    }
  }

  private pop(p: Pickup, good: boolean) {
    this.tweens.killTweensOf(p.box);
    this.burst(p.box.x, p.box.y, good ? [COLORS.good, COLORS.cyan, COLORS.yellow] : [COLORS.bad, '#6B7699'], good ? 18 : 10);
    this.tweens.add({ targets: p.box, scale: good ? 1.5 : 0.4, alpha: 0, duration: 260, onComplete: () => p.box.destroy() });
  }

  private completeMission(explanation: string, title = 'Mission complete!', answer?: string) {
    const i = this.mission;
    this.feedback('correct', title, explanation, answer);
    this.bridge.hud.set({ progressDone: i + 1 });
    // leftovers become harmless
    for (const p of this.pickups) if (p.mission === i && p.alive) {
      p.alive = false;
      this.tweens.add({ targets: p.box, alpha: 0.15, duration: 400 });
    }
    const gate = this.gates[i];
    gate.open = true;
    (gate.zone.body as Phaser.Physics.Arcade.StaticBody).enable = false;
    this.bridge.audio.sfx('gate');
    this.time.delayedCall(1800, () => {
      if (i + 1 < this.missions.length) this.startMission(i + 1);
      else {
        this.setPrompt({ kicker: 'All missions complete', text: 'Run to the UFO to finish! →' });
        this.bridge.hud.set({ stat: null });
      }
    });
  }

  /* ---------------- loop ---------------- */

  update(time: number, deltaMs: number) {
    const dt = Math.min(deltaMs, 50) / 1000;
    if (this.exiting) return;
    const input = this.bridge.input;
    const b = this.body;
    const onGround = b.blocked.down || b.touching.down;

    for (const s of this.stars) {
      s.r.x -= s.speed * dt * 0.15;
      if (s.r.x < -4) s.r.x = this.W + 4;
    }

    // horizontal
    let dir = 0;
    if (input.isDown('left')) dir -= 1;
    if (input.isDown('right')) dir += 1;
    const accel = onGround ? 2600 : 1600;
    if (dir !== 0) {
      this.facing = dir;
      b.setVelocityX(Phaser.Math.Clamp(b.velocity.x + dir * accel * dt, -RUN_SPEED, RUN_SPEED));
    } else {
      const drag = (onGround ? 2800 : 900) * dt;
      b.setVelocityX(Math.abs(b.velocity.x) <= drag ? 0 : b.velocity.x - Math.sign(b.velocity.x) * drag);
    }

    // jump with coyote time and buffering
    this.coyote = onGround ? 0.1 : this.coyote - dt;
    if (input.consume('action') || input.consume('up')) this.jumpBuffer = 0.13;
    else this.jumpBuffer -= dt;
    if (this.jumpBuffer > 0 && this.coyote > 0) {
      b.setVelocityY(-JUMP_V);
      this.jumpBuffer = 0;
      this.coyote = 0;
      this.bridge.audio.sfx('jump');
    }
    const holding = input.isDown('action') || input.isDown('up');
    if (!holding && b.velocity.y < -330) b.setVelocityY(-330);
    if (b.x < 0) b.x = 0;

    // draw the astronaut
    this.hero.setPosition(b.center.x, b.bottom + 2);
    this.hero.setFlipX(this.facing < 0);
    if (!onGround) this.hero.setTexture('wj-jump');
    else if (Math.abs(b.velocity.x) > 40) {
      this.runTimer += dt;
      if (this.runTimer > 0.09) {
        this.runTimer = 0;
        this.runFrame = (this.runFrame + 1) % RUN.length;
      }
      this.hero.setTexture(RUN[this.runFrame]);
    } else this.hero.setTexture('wj-idle');
    this.hero.setAlpha(time < this.invulnerableUntil && Math.floor(time / 90) % 2 ? 0.35 : 1);

    // gates
    this.gates.forEach((g, i) => {
      g.fx.clear();
      if (g.open) return;
      const x = this.L.gates[i];
      const a = 0.45 + 0.25 * Math.sin(time / 120);
      g.fx.fillStyle(0x39d9ff, a * 0.35).fillRect(x - 13, this.viewTop, 26, GROUND_Y - this.viewTop);
      for (let k = 0; k < 4; k++) g.fx.fillStyle(0xa8f0ff, a).fillRect(x - 10 + k * 6, this.viewTop, 2, GROUND_Y - this.viewTop);
      if (Math.abs(b.right - (x - 13)) < 6 && time > this.gateHintAt) {
        this.gateHintAt = time + 3500;
        this.feedback('info', 'Gate locked.', 'Finish the mission to open the energy gate!');
      }
    });

    // checkpoints
    this.L.checkpoints.forEach((cx, i) => {
      if (b.x > cx - 40 && this.respawnX < cx) {
        this.respawnX = cx;
        if (i > 0) {
          this.flags[i].clearTint();
          this.bridge.audio.sfx('checkpoint');
          this.burst(cx - 30, GROUND_Y - 60, [COLORS.cyan, COLORS.yellow], 14);
        }
      }
    });

    // enemies patrol
    for (const e of this.enemies) {
      e.img.x += e.dir * 90 * dt;
      if (e.img.x > e.x2) e.dir = -1;
      if (e.img.x < e.x1) e.dir = 1;
      e.img.setFlipX(e.dir < 0);
    }

    // pickups
    const hb = new Phaser.Geom.Rectangle(b.x, b.y, b.width, b.height);
    for (const p of this.pickups) {
      if (!p.alive || p.mission !== this.mission || time < p.cooldownUntil) continue;
      const r = new Phaser.Geom.Rectangle(p.box.x - p.w / 2, p.box.y - p.h / 2, p.w, p.h);
      if (Phaser.Geom.Intersects.RectangleToRectangle(hb, r)) this.collect(p);
    }
    for (const c of [...this.coins]) {
      if (Phaser.Geom.Intersects.RectangleToRectangle(hb, c.getBounds())) {
        this.bonus(10, { x: c.x, y: c.y - 20 });
        this.bridge.audio.sfx('coin');
        c.destroy();
        this.coins.splice(this.coins.indexOf(c), 1);
      }
    }

    // hazards
    if (time > this.invulnerableUntil) {
      const hit = this.spikeZones.some((z) => Phaser.Geom.Intersects.RectangleToRectangle(hb, z))
        || this.enemies.some((e) => Phaser.Geom.Intersects.RectangleToRectangle(hb, shrink(e.img.getBounds(), 10)));
      if (hit || b.y > LEVEL_H + 120) this.respawn();
    }

    // exit
    if (this.gates.every((g) => g.open) && Math.abs(b.center.x - this.L.portalX) < 70) this.exit();
  }

  private respawn() {
    this.bridge.audio.sfx('crash');
    this.shake(0.006, 160);
    this.burst(this.body.center.x, this.body.center.y, ['#F5F7FF', COLORS.orange], 12);
    this.body.reset(this.respawnX, GROUND_Y - BODY_H - 10);
    this.invulnerableUntil = this.time.now + 1300;
    this.feedback('info', 'Oops!', 'Back to the last flag. Keep going!');
  }

  private exit() {
    this.exiting = true;
    this.body.setVelocity(0, 0).setAllowGravity(false);
    this.bridge.audio.sfx('win');
    this.tweens.add({ targets: this.hero, y: GROUND_Y - 300, alpha: 0, scale: 0.3, duration: 1100, ease: 'Cubic.easeIn' });
    this.banner('MISSION COMPLETE', COLORS.yellow, 1500);
    this.time.delayedCall(1700, () => this.finishGame({ missions: this.missions.length }));
  }
}

function shrink(r: Phaser.Geom.Rectangle, by: number) {
  return new Phaser.Geom.Rectangle(r.x + by, r.y + by, Math.max(1, r.width - by * 2), Math.max(1, r.height - by * 2));
}
