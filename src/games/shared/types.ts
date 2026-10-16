import type { ComponentType } from 'react';
import type Phaser from 'phaser';
import type { Rng } from '../../education/questionEngine';
import type { CefrLevel, GameId } from '../../education/types';
import type { ScoreKeeper } from '../../services/progress/scoring';
import type { AudioEngine, MusicTrack } from './audio';
import type { InputState } from './input';
import type { Channel, Store } from './store';

export interface HudPrompt {
  /** Small line above the prompt, e.g. "Complete the sentence". */
  kicker: string;
  /** Main text. "___" is drawn as a gap. */
  text: string;
  /** Texture key of a pixel picture clue (e.g. "icon-cat"). */
  icon?: string | null;
  /** Numbered answer options shown under the text (lane gates). */
  options?: string[] | null;
  /** Spelling slots: letters found so far (null = empty) and the next slot to fill. */
  slots?: { letters: (string | null)[]; next: number } | null;
}

export interface HudFeedback {
  /** Changes on every new message so React can replay the animation. */
  id: number;
  kind: 'correct' | 'wrong' | 'info';
  title: string;
  /** The full correct sentence/answer. */
  answer?: string;
  /** Short explanation. */
  text?: string;
}

export interface HudState {
  score: number;
  combo: number;
  multiplier: number;
  progressLabel: string;
  progressDone: number;
  progressTotal: number;
  prompt: HudPrompt | null;
  feedback: HudFeedback | null;
  lives: { current: number; max: number } | null;
  stat: { label: string; value: string } | null;
  /** 0–1 time left for the current challenge, or null. */
  timer: number | null;
}

export const initialHud = (total: number, label = 'Mission'): HudState => ({
  score: 0,
  combo: 0,
  multiplier: 1,
  progressLabel: label,
  progressDone: 0,
  progressTotal: total,
  prompt: null,
  feedback: null,
  lives: null,
  stat: null,
  timer: null,
});

export type ResultMeta = Record<string, string | number | boolean>;

/** Everything a running scene can use. Created by the play screen for each session. */
export interface GameBridge<C = unknown, P = unknown> {
  gameId: GameId;
  level: CefrLevel;
  content: C;
  keeper: ScoreKeeper;
  hud: Store<HudState>;
  /** Game-specific state shown by the game's React panel. */
  panel: Store<P>;
  channel: Channel;
  input: InputState;
  audio: AudioEngine;
  reducedMotion: boolean;
  /** Ends the session as completed. Safe to call more than once. */
  finish(meta?: ResultMeta): void;
}

export interface SessionContent<C> {
  /** Content ids practised in this session. */
  contentIds: string[];
  data: C;
  /** Number of challenges, for the progress bar. */
  total: number;
}

export interface ControlHint {
  action: string;
  keyboard: string;
  touch: string;
}

export interface GameDefinition<C = unknown, P = unknown> {
  id: GameId;
  title: string;
  tagline: string;
  genre: string;
  skills: string[];
  howTo: string[];
  controls: ControlHint[];
  /** CSS colour for this game's cabinet. */
  accent: string;
  /** Texture key + frame for the cabinet art. */
  cabinet: { sprite: string; frame?: number; background: string };
  music: MusicTrack;
  touch: 'none' | 'shooter' | 'platformer' | 'racer';
  /** 'side' puts the game's React panel next to (or under) the canvas. */
  layout: 'stage' | 'side';
  /** Fixed logical size; otherwise the canvas follows the screen's shape. */
  fixedSize?: { width: number; height: number };
  progressLabel: string;
  /** Picks this session's content. Throws ContentError when the level has none. */
  buildSession(level: CefrLevel, ctx: { recent: string[]; rng: Rng }): SessionContent<C>;
  initialPanel: () => P;
  /** Lazy so Phaser and the scene only load when a game starts. */
  loadScene: () => Promise<new () => Phaser.Scene>;
  /** Optional React panel (lazy). */
  loadPanel?: () => Promise<ComponentType<{ bridge: GameBridge<C, P> }>>;
  /** One line for the results screen from the result meta, e.g. "You finished 1st!". */
  resultLine?: (meta: ResultMeta | undefined) => string | null;
}
