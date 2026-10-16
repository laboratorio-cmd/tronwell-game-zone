/**
 * Retro sound effects and chiptune loops synthesised with Web Audio (no audio files).
 * Audio starts only after a user gesture (unlock()).
 */
export type SfxName =
  | 'click' | 'shoot' | 'hit' | 'explode' | 'correct' | 'wrong' | 'coin' | 'jump' | 'boost'
  | 'crash' | 'pause' | 'win' | 'reveal' | 'select' | 'tick' | 'checkpoint' | 'gate' | 'combo';

export type MusicTrack = 'blaster' | 'jumper' | 'racer' | 'detective';

type Note = number | null;

interface Track {
  bpm: number;
  bass: Note[];
  lead: Note[];
  drums: string; // k = kick, s = snare, h = hat, . = rest (one char per 16th)
  wave: OscillatorType;
}

// MIDI note numbers; 16 steps per bar.
const TRACKS: Record<MusicTrack, Track> = {
  blaster: {
    bpm: 132,
    wave: 'square',
    bass: [40, null, 40, null, 47, null, 40, null, 38, null, 38, null, 45, null, 43, null, 36, null, 36, null, 43, null, 36, null, 38, null, 45, null, 43, null, 42, null],
    lead: [64, 67, 71, null, 69, null, 67, null, 62, 66, 69, null, 67, null, 66, null, 60, 64, 67, null, 72, null, 71, null, 62, null, 66, 69, 71, null, 74, null],
    drums: 'k.h.s.h.k.h.s.hhk.h.s.h.kkh.s.hh',
  },
  jumper: {
    bpm: 118,
    wave: 'square',
    bass: [43, null, 50, null, 43, null, 50, null, 40, null, 47, null, 40, null, 47, null, 36, null, 43, null, 36, null, 43, null, 38, null, 45, null, 38, null, 45, null],
    lead: [67, null, 71, 74, null, 71, 69, null, 64, null, 67, 71, null, 69, 67, null, 60, null, 64, 67, 72, null, 71, 69, 62, null, 66, 69, 74, null, 72, null],
    drums: 'k...s...k.k.s...k...s...k.k.s.h.',
  },
  racer: {
    bpm: 150,
    wave: 'sawtooth',
    bass: [33, 33, 45, 33, 33, 45, 33, 45, 31, 31, 43, 31, 31, 43, 31, 43, 29, 29, 41, 29, 29, 41, 29, 41, 31, 31, 43, 31, 33, 45, 35, 47],
    lead: [69, null, 72, null, 76, null, 74, 72, 67, null, 71, null, 74, null, 72, 71, 65, null, 69, null, 72, null, 71, 69, 67, null, 71, 74, 79, null, 76, null],
    drums: 'k.hsk.hsk.hsk.hhk.hsk.hsk.hskshs',
  },
  detective: {
    bpm: 96,
    wave: 'triangle',
    bass: [38, null, null, 45, null, null, 41, null, 36, null, null, 43, null, null, 40, null, 34, null, null, 41, null, null, 38, null, 33, null, null, 40, null, 37, null, null],
    lead: [62, null, 65, null, 69, null, 68, null, 67, null, null, 64, null, null, null, null, 58, null, 62, null, 65, null, 64, null, 61, null, 64, null, 67, null, 65, null],
    drums: 'k.......s.....h.k.......s...h.h.',
  },
};

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private volume = 0.7;
  private muted = false;
  private musicOn = true;
  private track: MusicTrack | null = null;
  private step = 0;
  private nextTime = 0;
  private timer: number | null = null;
  private musicPaused = false;

  configure(o: { volume: number; muted: boolean; music: boolean }) {
    this.volume = o.volume;
    this.muted = o.muted;
    this.musicOn = o.music;
    this.applyGain();
    if (!this.musicOn) this.stopScheduler();
    else if (this.track && !this.musicPaused) this.startScheduler();
  }

  /** Must be called from a click/tap/key handler (browser autoplay rules). */
  unlock() {
    if (typeof window === 'undefined') return;
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        this.ctx = new Ctor();
        this.master = this.ctx.createGain();
        this.master.connect(this.ctx.destination);
        this.musicGain = this.ctx.createGain();
        this.musicGain.connect(this.master);
        const len = this.ctx.sampleRate * 0.5;
        this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const data = this.noise.getChannelData(0);
        for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
        this.applyGain();
      }
      if (this.ctx.state === 'suspended') void this.ctx.resume();
    } catch {
      this.ctx = null;
    }
  }

  private applyGain() {
    if (!this.master || !this.musicGain || !this.ctx) return;
    this.master.gain.setValueAtTime(this.muted ? 0 : this.volume * 0.5, this.ctx.currentTime);
    this.musicGain.gain.setValueAtTime(0.32, this.ctx.currentTime);
  }

  private tone(freq: number, dur: number, opts: { type?: OscillatorType; vol?: number; slide?: number; at?: number; out?: AudioNode } = {}) {
    if (!this.ctx || !this.master) return;
    const t = opts.at ?? this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = opts.type ?? 'square';
    osc.frequency.setValueAtTime(freq, t);
    if (opts.slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, opts.slide), t + dur);
    g.gain.setValueAtTime(opts.vol ?? 0.2, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(opts.out ?? this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  private hiss(dur: number, opts: { vol?: number; at?: number; freq?: number; out?: AudioNode } = {}) {
    if (!this.ctx || !this.master || !this.noise) return;
    const t = opts.at ?? this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = opts.freq ?? 1800;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(opts.vol ?? 0.3, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(opts.out ?? this.master);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  sfx(name: SfxName) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    switch (name) {
      case 'click': this.tone(880, 0.05, { vol: 0.12 }); break;
      case 'select': this.tone(660, 0.06, { vol: 0.12 }); this.tone(990, 0.08, { vol: 0.12, at: t + 0.05 }); break;
      case 'shoot': this.tone(1200, 0.12, { slide: 300, vol: 0.1 }); break;
      case 'hit': this.hiss(0.15, { vol: 0.35, freq: 900 }); this.tone(160, 0.15, { slide: 60, vol: 0.2 }); break;
      case 'explode': this.hiss(0.45, { vol: 0.45, freq: 500 }); this.tone(120, 0.4, { slide: 40, vol: 0.25 }); break;
      case 'correct': [72, 76, 79, 84].forEach((n, i) => this.tone(midi(n), 0.12, { vol: 0.16, at: t + i * 0.06 })); break;
      case 'wrong': this.tone(220, 0.18, { type: 'sawtooth', vol: 0.12 }); this.tone(165, 0.25, { type: 'sawtooth', vol: 0.12, at: t + 0.12 }); break;
      case 'coin': this.tone(988, 0.07, { vol: 0.14 }); this.tone(1319, 0.16, { vol: 0.14, at: t + 0.07 }); break;
      case 'jump': this.tone(300, 0.18, { slide: 700, vol: 0.12 }); break;
      case 'boost': this.tone(200, 0.6, { type: 'sawtooth', slide: 900, vol: 0.12 }); this.hiss(0.5, { vol: 0.15, freq: 3000 }); break;
      case 'crash': this.hiss(0.35, { vol: 0.4, freq: 700 }); this.tone(90, 0.3, { slide: 40, vol: 0.2, type: 'sawtooth' }); break;
      case 'pause': this.tone(523, 0.08, { vol: 0.12 }); this.tone(392, 0.12, { vol: 0.12, at: t + 0.08 }); break;
      case 'win': [60, 64, 67, 72, 67, 72, 76, 79].forEach((n, i) => this.tone(midi(n), i === 7 ? 0.5 : 0.13, { vol: 0.15, at: t + i * 0.11 })); break;
      case 'reveal': [67, 71, 74, 79].forEach((n, i) => this.tone(midi(n), 0.2, { type: 'triangle', vol: 0.18, at: t + i * 0.08 })); break;
      case 'tick': this.tone(1500, 0.03, { vol: 0.06 }); break;
      case 'checkpoint': [64, 67, 72].forEach((n, i) => this.tone(midi(n), 0.12, { type: 'triangle', vol: 0.18, at: t + i * 0.08 })); break;
      case 'gate': this.tone(330, 0.3, { type: 'triangle', slide: 660, vol: 0.16 }); break;
      case 'combo': this.tone(1046, 0.08, { vol: 0.12 }); this.tone(1568, 0.12, { vol: 0.12, at: t + 0.06 }); break;
    }
  }

  music(track: MusicTrack | null) {
    if (track === this.track && this.timer !== null) return;
    this.track = track;
    this.step = 0;
    this.musicPaused = false;
    this.stopScheduler();
    if (track && this.musicOn) this.startScheduler();
  }

  pauseMusic() {
    this.musicPaused = true;
    this.stopScheduler();
  }

  resumeMusic() {
    this.musicPaused = false;
    if (this.track && this.musicOn) this.startScheduler();
  }

  stopMusic() {
    this.track = null;
    this.stopScheduler();
  }

  private startScheduler() {
    if (!this.ctx || this.timer !== null) return;
    this.nextTime = this.ctx.currentTime + 0.05;
    this.timer = window.setInterval(() => this.schedule(), 50);
  }

  private stopScheduler() {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
  }

  private schedule() {
    if (!this.ctx || !this.track || !this.musicGain) return;
    const tr = TRACKS[this.track];
    const stepDur = 60 / tr.bpm / 4;
    while (this.nextTime < this.ctx.currentTime + 0.15) {
      const i = this.step % tr.bass.length;
      const b = tr.bass[i];
      const l = tr.lead[i % tr.lead.length];
      const d = tr.drums[i % tr.drums.length];
      if (b !== null) this.tone(midi(b), stepDur * 1.6, { type: 'triangle', vol: 0.22, at: this.nextTime, out: this.musicGain });
      if (l !== null) this.tone(midi(l), stepDur * 0.9, { type: tr.wave, vol: 0.06, at: this.nextTime, out: this.musicGain });
      if (d === 'k') this.tone(140, 0.12, { slide: 45, vol: 0.35, at: this.nextTime, out: this.musicGain });
      if (d === 's') this.hiss(0.1, { vol: 0.18, freq: 1600, at: this.nextTime, out: this.musicGain });
      if (d === 'h') this.hiss(0.03, { vol: 0.06, freq: 7000, at: this.nextTime, out: this.musicGain });
      this.nextTime += stepDur;
      this.step++;
    }
  }
}

export const audio = new AudioEngine();
