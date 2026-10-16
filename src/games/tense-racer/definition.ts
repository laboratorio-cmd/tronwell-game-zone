import {
  ContentError, getItems, ofKind, orderSentence, pickItems, prepareChoice, scrambleChunks, type PreparedChoice,
} from '../../education/questionEngine';
import type { OrderItem } from '../../education/types';
import type { GameDefinition } from '../shared/types';

export type RaceChallenge =
  | { kind: 'gate'; choice: PreparedChoice }
  | { kind: 'pit'; item: OrderItem; chunks: string[] };

export interface RacerContent {
  challenges: RaceChallenge[];
}

/** State of the pit-stop sentence builder (React panel). */
export interface PitPanel {
  open: boolean;
  instruction: string;
  chunks: string[];
  /** Indexes into chunks, in the order the player tapped them. */
  picked: number[];
  result: 'correct' | 'wrong' | null;
  answer: string;
  punctuation: string;
}

export const closedPit = (): PitPanel => ({ open: false, instruction: '', chunks: [], picked: [], result: null, answer: '', punctuation: '.' });

/** Gate (G) and pit-stop (P) order for one race. */
const PATTERN = ['G', 'G', 'P', 'G', 'G', 'P', 'G', 'P'] as const;

export const tenseRacer: GameDefinition<RacerContent, PitPanel> = {
  id: 'tense-racer',
  title: 'Tense Racer',
  tagline: 'Pick the right tense to turbo-boost to the finish.',
  genre: 'Arcade racing',
  skills: ['Tense choice', 'Word order', 'Questions', 'Negatives'],
  howTo: [
    'Steer through the gate with the answer that completes the sentence. Right answers give you TURBO.',
    'At a pit stop, tap the words in the right order to build the sentence.',
    'Dodge cones and oil, beat the other racers to the finish line!',
  ],
  controls: [
    { action: 'Change lane', keyboard: '↑ ↓ or W S', touch: '▲ ▼ buttons' },
    { action: 'Choose a gate', keyboard: '1 2 3 (top to bottom)', touch: 'Steer into it' },
    { action: 'Build a sentence', keyboard: 'Number keys, Backspace', touch: 'Tap the words' },
  ],
  accent: '#FF9F43',
  cabinet: { sprite: 'tr-car-blue', background: 'bg-tense-racer-1' },
  music: 'racer',
  touch: 'racer',
  layout: 'stage',
  fixedSize: { width: 1280, height: 720 },
  progressLabel: 'Challenge',
  buildSession(level, { recent, rng }) {
    const items = getItems('tense-racer', level);
    const choices = ofKind(items, 'choice');
    const orders = ofKind(items, 'order');
    if (!choices.length && !orders.length) throw new ContentError('There are no Tense Racer challenges for this level yet.', 'empty');
    const gates = choices.length ? pickItems(choices, 5, { recent, rng }) : [];
    const pits = orders.length ? pickItems(orders, 3, { recent, rng }) : [];
    const challenges: RaceChallenge[] = [];
    let g = 0;
    let p = 0;
    for (const slot of PATTERN) {
      if (slot === 'G' && gates[g]) challenges.push({ kind: 'gate', choice: prepareChoice(gates[g++], rng) });
      else if (slot === 'P' && pits[p]) {
        const item = pits[p++];
        challenges.push({ kind: 'pit', item, chunks: scrambleChunks(item, rng) });
      }
    }
    return {
      contentIds: challenges.map((c) => (c.kind === 'gate' ? c.choice.item.id : c.item.id)),
      data: { challenges },
      total: challenges.length,
    };
  },
  initialPanel: closedPit,
  loadScene: () => import('./RacerScene').then((m) => m.RacerScene),
  loadPanel: () => import('./PitStopPanel').then((m) => m.PitStopPanel),
  resultLine: (meta) => {
    const pos = Number(meta?.position);
    if (!pos) return null;
    const suffix = pos === 1 ? 'st' : pos === 2 ? 'nd' : pos === 3 ? 'rd' : 'th';
    return `You finished ${pos}${suffix} of ${meta?.racers ?? 4}!`;
  },
};

export { orderSentence };
