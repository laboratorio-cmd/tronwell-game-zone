import Phaser from 'phaser';
import type { CaseScene, DetectiveCase } from '../../education/types';
import { BaseScene, textStyle } from '../shared/BaseScene';
import { digitIndex } from '../shared/input';
import { evidenceTexture, lookTexture, preloadAssets } from '../shared/pixel/manifest';
import { COLORS } from '../shared/pixel/palette';
import {
  accuse, answerQuestion, currentQuestion, examine, findThing, isSolved, isVisible, missingFor, nameOf, prove,
  questionReady, startInvestigation, type CaseState,
} from './caseMachine';
import type { DetectiveContent, DetectivePanelState } from './definition';

const SCENE_BG: Record<CaseScene, string> = {
  lab: 'bg-english-detective-1',
  cafe: 'bg-english-detective-2',
  library: 'bg-english-detective-3',
  garden: 'bg-english-detective-4',
  hangar: 'bg-english-detective-5',
  quarters: 'bg-english-detective-6',
};
const DETECTIVE = ['ed-detective', 'ed-walk-1', 'ed-walk-2', 'ed-walk-3', 'ed-inspect', 'ed-ask'];
const WALK = ['ed-walk-1', 'ed-walk-2', 'ed-walk-3'];

interface Hotspot {
  id: string;
  img: Phaser.GameObjects.Image;
  marker: Phaser.GameObjects.GameObject;
  standX: number;
  standY: number;
}

export class DetectiveScene extends BaseScene<DetectiveContent, DetectivePanelState> {
  private c!: DetectiveCase;
  private s!: CaseState;
  private hero!: Phaser.GameObjects.Image;
  private spots = new Map<string, Hotspot>();
  private walkTimer = 0;
  private walkFrame = 0;
  private walking = false;
  private pending: string | null = null;
  private steps = 0;

  preload() {
    const c = this.bridge.content.case;
    preloadAssets(this, this.assetKeys(c));
  }

  private assetKeys(c: DetectiveCase) {
    return [SCENE_BG[c.scene], ...DETECTIVE, ...c.suspects.map((s) => lookTexture(s.look)), ...c.evidence.map((e) => evidenceTexture(e.sprite))];
  }

  create() {
    this.c = this.bridge.content.case;
    this.s = this.bridge.panel.get().state;
    this.makeTextures(this.assetKeys(this.c));
    this.crisp(...this.assetKeys(this.c));
    this.backdrop(SCENE_BG[this.c.scene], { dim: 0.12 });
    // soft floor shadow line so people and clues read clearly
    this.add.rectangle(this.W / 2, this.H * 0.75, this.W, this.H * 0.5, 0x0b1024, 0.18).setDepth(-150);

    this.placeSuspects();
    this.c.evidence.forEach((e) => this.placeEvidence(e.id));

    this.hero = this.add.image(this.W * 0.08, this.H * 0.95, 'ed-detective').setOrigin(0.5, 1).setDepth(500);
    this.hero.setScale(190 / this.hero.height);

    this.onCleanup(this.bridge.channel.on('start', () => this.begin()));
    this.onCleanup(this.bridge.channel.on<string>('examine', (id) => this.goTo(id)));
    this.onCleanup(this.bridge.channel.on<number>('answer', (i) => this.onAnswer(i)));
    this.onCleanup(this.bridge.channel.on<number>('accuse', (i) => this.onAccuse(i)));
    this.onCleanup(this.bridge.channel.on<number>('prove', (i) => this.onProve(i)));
    this.onCleanup(this.bridge.channel.on('dismiss', () => this.bridge.panel.set({ lastAnswer: null })));
    this.onCleanup(this.bridge.channel.on('close', () => this.finishGame({ solved: isSolved(this.c, this.s) })));
    this.onCleanup(
      this.bridge.input.onKey((code, e) => {
        const d = digitIndex(code);
        if (d === null || (e.target as HTMLElement | null)?.tagName === 'INPUT') return;
        const p = this.bridge.panel.get();
        if (p.lastAnswer) return;
        if (this.s.phase === 'investigate') {
          const q = currentQuestion(this.c, this.s);
          if (q && questionReady(this.s, q)) this.onAnswer(d);
        } else if (this.s.phase === 'accuse') this.onAccuse(d);
        else if (this.s.phase === 'proof') this.onProve(d);
      }),
    );

    this.bridge.hud.set({ progressTotal: this.c.questions.length + 2, progressLabel: 'Case notes' });
    this.setPrompt({ kicker: 'New case', text: this.c.title });
    this.sync();
  }

  /* ---------------- room ---------------- */

  private placeSuspects() {
    const n = this.c.suspects.length;
    this.c.suspects.forEach((sp, i) => {
      const x = this.W * (0.3 + (0.45 * (i + 0.5)) / n);
      const y = this.H * 0.52;
      const img = this.add.image(x, y, lookTexture(sp.look)).setOrigin(0.5, 1).setDepth(100 + y);
      img.setScale(200 / img.height);
      const tag = this.add.text(x, y + 6, sp.name, textStyle(20, COLORS.text)).setOrigin(0.5, 0).setDepth(101 + y);
      const bubble = this.add.image(x + img.displayWidth * 0.35, y - img.displayHeight - 4, 'ed-ask').setScale(0.42).setDepth(102 + y);
      if (this.motion) this.tweens.add({ targets: bubble, y: bubble.y - 8, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.easeInOut' });
      this.makeClickable(sp.id, img);
      tag.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.goTo(sp.id));
      this.spots.set(sp.id, { id: sp.id, img, marker: bubble, standX: x - 90, standY: this.H * 0.68 });
    });
  }

  private placeEvidence(id: string) {
    const e = this.c.evidence.find((x) => x.id === id);
    if (!e) return;
    const x = this.W * e.x;
    const y = this.H * Math.max(0.56, e.y);
    const img = this.add.image(x, y, evidenceTexture(e.sprite)).setDepth(100 + y);
    img.setScale(Math.min(76 / img.width, 76 / img.height) * (img.width < 20 ? 1 : 1));
    const ring = this.add.circle(x, y, 52, 0xffd166, 0).setStrokeStyle(4, 0xffd166, 0.9).setDepth(99 + y);
    if (this.motion) this.tweens.add({ targets: ring, scale: 1.15, alpha: 0.35, yoyo: true, repeat: -1, duration: 650 });
    this.makeClickable(id, img);
    ring.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.goTo(id));
    const hidden = !!e.hidden && !this.s.revealed.includes(id);
    img.setVisible(!hidden);
    ring.setVisible(!hidden);
    this.spots.set(id, { id, img, marker: ring, standX: x - 80, standY: Math.min(this.H * 0.97, y + 80) });
  }

  private makeClickable(id: string, img: Phaser.GameObjects.Image) {
    img.setInteractive({ useHandCursor: true });
    img.on('pointerdown', () => this.goTo(id));
    img.on('pointerover', () => img.setTint(0xfff1c4));
    img.on('pointerout', () => img.clearTint());
  }

  private reveal(ids: string[]) {
    for (const id of ids) {
      const spot = this.spots.get(id);
      if (!spot) continue;
      spot.img.setVisible(true).setAlpha(0);
      (spot.marker as Phaser.GameObjects.Arc).setVisible(true);
      this.tweens.add({ targets: spot.img, alpha: 1, duration: 500 });
      this.burst(spot.img.x, spot.img.y, [COLORS.yellow, COLORS.cyan, COLORS.text], 22);
    }
    if (ids.length) this.bridge.audio.sfx('reveal');
  }

  /* ---------------- walking ---------------- */

  private goTo(id: string) {
    if (this.s.phase === 'briefing' || this.s.phase === 'closed') return;
    if (!isVisible(this.c, this.s, id)) return;
    const spot = this.spots.get(id);
    if (!spot) return;
    if (this.walking) {
      this.pending = id;
      return;
    }
    const dx = spot.standX - this.hero.x;
    const dy = spot.standY - this.hero.y;
    const dist = Math.hypot(dx, dy);
    this.bridge.audio.sfx('select');
    if (dist < 12) {
      this.arrive(id);
      return;
    }
    this.walking = true;
    this.hero.setFlipX(dx < 0);
    this.tweens.add({
      targets: this.hero,
      x: spot.standX,
      y: spot.standY,
      duration: this.motion ? Math.max(250, (dist / 520) * 1000) : 120,
      onComplete: () => {
        this.walking = false;
        this.arrive(id);
        if (this.pending && this.pending !== id) {
          const next = this.pending;
          this.pending = null;
          this.goTo(next);
        } else this.pending = null;
      },
    });
  }

  private arrive(id: string) {
    const thing = findThing(this.c, id);
    if (!thing) return;
    this.hero.setTexture(thing.kind === 'evidence' ? 'ed-inspect' : 'ed-detective').setFlipX(false);
    this.hero.setScale(190 / this.hero.height);
    const before = currentQuestion(this.c, this.s);
    const wasReady = before ? questionReady(this.s, before) : false;
    const first = !this.s.examined.includes(id);
    this.s = examine(this.c, this.s, id);
    if (first) {
      this.bridge.audio.sfx(thing.kind === 'suspect' ? 'click' : 'coin');
      const spot = this.spots.get(id);
      if (spot) {
        if (thing.kind === 'suspect') (spot.marker as Phaser.GameObjects.Image).setVisible(false);
        else {
          this.tweens.killTweensOf(spot.marker);
          (spot.marker as Phaser.GameObjects.Arc).setStrokeStyle(3, 0x3ddc84, 0.8).setScale(0.8).setAlpha(0.6);
        }
      }
      if (this.c.evidence.every((e) => this.s.examined.includes(e.id)) && this.c.suspects.every((x) => this.s.examined.includes(x.id))) {
        this.bonus(50, { x: this.hero.x, y: this.hero.y - 220 }, 'Every clue ');
      }
    }
    this.bridge.panel.set({ viewing: id });
    const now = currentQuestion(this.c, this.s);
    if (now && !wasReady && questionReady(this.s, now)) {
      this.bridge.audio.sfx('reveal');
      this.feedback('info', 'New question!', 'Answer it in your case notebook.');
    }
    this.sync();
  }

  /* ---------------- case flow ---------------- */

  private begin() {
    this.s = startInvestigation(this.s);
    this.bridge.audio.sfx('select');
    this.sync();
  }

  private onAnswer(choice: number) {
    const q = currentQuestion(this.c, this.s);
    if (!q || this.bridge.panel.get().lastAnswer) return;
    const step = answerQuestion(this.c, this.s, q.id, choice);
    if (!step) return;
    this.s = step.state;
    this.steps++;
    this.bridge.hud.set({ feedback: null });
    this.answer(
      { itemId: `${this.c.id}:${q.id}`, correct: step.correct, category: q.category, difficulty: this.c.difficulty, prompt: q.prompt, given: q.choices[choice], expected: q.choices[q.answer], feedback: q.feedback },
      { x: this.hero.x, y: this.hero.y - 220 },
    );
    this.bridge.hud.set({ progressDone: this.steps });
    this.bridge.panel.set({ lastAnswer: { correct: step.correct, feedback: q.feedback, answer: q.choices[q.answer] } });
    if (step.revealed.length) {
      this.reveal(step.revealed);
      this.feedback('info', 'New clue in the room!', step.revealed.map((id) => nameOf(this.c, id)).join(', '));
    }
    this.sync();
  }

  private onAccuse(choice: number) {
    const r = accuse(this.c, this.s, choice);
    if (!r) return;
    this.s = r.state;
    this.steps++;
    this.answer(
      { itemId: `${this.c.id}:solution`, correct: r.correct, category: 'reading-inference', difficulty: this.c.difficulty, prompt: this.c.solution.question, given: this.c.solution.choices[choice], expected: this.c.solution.choices[this.c.solution.answer], feedback: this.c.solution.explanation },
      { x: this.hero.x, y: this.hero.y - 220 },
    );
    this.bridge.hud.set({ progressDone: this.steps });
    this.sync();
  }

  private onProve(choice: number) {
    const r = prove(this.c, this.s, choice);
    if (!r) return;
    this.s = r.state;
    this.steps++;
    this.answer(
      { itemId: `${this.c.id}:proof`, correct: r.correct, category: 'reading-inference', difficulty: this.c.difficulty, prompt: this.c.proof.question, given: this.c.proof.choices[choice], expected: this.c.proof.choices[this.c.proof.answer], feedback: this.c.proof.explanation },
      { x: this.hero.x, y: this.hero.y - 220 },
    );
    this.bridge.hud.set({ progressDone: this.steps });
    const solved = isSolved(this.c, this.s);
    if (solved) this.bonus(300, { x: this.W / 2, y: this.H / 2 }, 'Case solved ');
    this.bridge.audio.sfx(solved ? 'win' : 'reveal');
    this.banner(solved ? 'CASE CLOSED!' : 'CASE CLOSED', solved ? COLORS.good : COLORS.yellow, 1600);
    this.sync();
  }

  /** Pushes the case state to the React notebook and the HUD prompt. */
  private sync() {
    this.bridge.panel.set({ state: this.s });
    if (this.s.phase !== 'investigate') this.bridge.hud.set({ feedback: null });
    const c = this.c;
    const s = this.s;
    let text = '';
    switch (s.phase) {
      case 'briefing':
        text = 'Read the case file, then start investigating.';
        break;
      case 'investigate': {
        const q = currentQuestion(c, s);
        if (q && questionReady(s, q)) text = `Question ${c.questions.indexOf(q) + 1}: ${q.prompt}`;
        else if (q) text = `To open the next question: ${missingFor(s, q).map((id) => (findThing(c, id)?.kind === 'suspect' ? `talk to ${nameOf(c, id)}` : `examine the ${nameOf(c, id).toLowerCase()}`)).join(', ')}.`;
        break;
      }
      case 'accuse':
        text = c.solution.question;
        break;
      case 'proof':
        text = c.proof.question;
        break;
      case 'closed':
        text = isSolved(c, s) ? 'You solved the case!' : 'Case closed. Read what really happened.';
    }
    this.setPrompt({ kicker: `Case: ${c.title}`, text });
  }

  update(_t: number, deltaMs: number) {
    if (!this.walking) return;
    this.walkTimer += deltaMs;
    if (this.walkTimer > 140) {
      this.walkTimer = 0;
      this.walkFrame = (this.walkFrame + 1) % WALK.length;
      this.hero.setTexture(WALK[this.walkFrame]);
      this.hero.setScale(190 / this.hero.height);
    }
    this.hero.setDepth(100 + this.hero.y + 1);
  }
}
