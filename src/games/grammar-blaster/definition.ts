import { getItems, ofKind, pickItems, prepareChoice, type PreparedChoice } from '../../education/questionEngine';
import type { GameDefinition } from '../shared/types';

export interface BlasterContent {
  waves: PreparedChoice[];
}

export const WAVES_PER_SESSION = 10;

export const grammarBlaster: GameDefinition<BlasterContent, null> = {
  id: 'grammar-blaster',
  title: 'Grammar Blaster',
  tagline: 'Blast the asteroid that completes the sentence.',
  genre: 'Space shooter',
  skills: ['Verb forms', 'Auxiliaries', 'Questions & negatives', 'Tenses'],
  howTo: [
    'Read the sentence at the top of the screen.',
    'Shoot the asteroid with the word that fills the gap. You can also tap it or press its number.',
    'Right answers build your combo. Dodge or blast the enemy ships!',
  ],
  controls: [
    { action: 'Move', keyboard: '← → or A D', touch: 'Drag the ship or use ◀ ▶' },
    { action: 'Fire', keyboard: 'Space', touch: 'FIRE button' },
    { action: 'Lock on', keyboard: '1 2 3 4', touch: 'Tap an asteroid' },
  ],
  accent: '#FF5468',
  cabinet: { sprite: 'gb-ship', background: 'bg-grammar-blaster-1' },
  music: 'blaster',
  touch: 'shooter',
  layout: 'stage',
  progressLabel: 'Wave',
  buildSession(level, { recent, rng }) {
    const items = ofKind(getItems('grammar-blaster', level), 'choice');
    const picked = pickItems(items, WAVES_PER_SESSION, { recent, rng, min: 3 });
    return {
      contentIds: picked.map((i) => i.id),
      data: { waves: picked.map((i) => prepareChoice(i, rng)) },
      total: picked.length,
    };
  },
  initialPanel: () => null,
  loadScene: () => import('./BlasterScene').then((m) => m.BlasterScene),
};
