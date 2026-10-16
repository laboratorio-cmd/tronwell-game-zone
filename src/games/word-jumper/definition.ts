import { ContentError, getItems, ofKind, pickItems, shuffle } from '../../education/questionEngine';
import type { CategoryItem, SpellItem } from '../../education/types';
import { iconTexture } from '../shared/pixel/assets';
import type { GameDefinition } from '../shared/types';

export interface WordCrystal {
  text: string;
  correct: boolean;
  icon: string | null;
}

export type JumperMission =
  | { kind: 'category'; item: CategoryItem; words: WordCrystal[] }
  | { kind: 'spell'; item: SpellItem; letters: string[]; icon: string | null };

export interface JumperContent {
  missions: JumperMission[];
}

export const MISSIONS_PER_SESSION = 4;

export const wordJumper: GameDefinition<JumperContent, null> = {
  id: 'word-jumper',
  title: 'Word Jumper',
  tagline: 'Run, jump and collect the right words.',
  genre: 'Platformer',
  skills: ['Vocabulary', 'Spelling', 'Word groups', 'Picture words'],
  howTo: [
    'Read your mission at the top: find a group of words, or spell a word letter by letter.',
    'Run and jump to collect the right crystals. The energy gate opens when the mission is done.',
    'Avoid spikes, holes and drones. If you fall, you go back to the last beacon.',
  ],
  controls: [
    { action: 'Run', keyboard: '← → or A D', touch: '◀ ▶ buttons' },
    { action: 'Jump', keyboard: 'Space, ↑ or W', touch: 'JUMP button' },
  ],
  accent: '#39D9FF',
  cabinet: { sprite: 'wj-run-1', background: 'bg-word-jumper-1' },
  music: 'jumper',
  touch: 'platformer',
  layout: 'stage',
  progressLabel: 'Mission',
  buildSession(level, { recent, rng }) {
    const items = getItems('word-jumper', level);
    const pick = <T extends { id: string }>(list: T[]) => (list.length ? pickItems(list, 2, { recent, rng }) : []);
    const cats = pick(ofKind(items, 'category'));
    const spells = pick(ofKind(items, 'spell'));
    if (!cats.length && !spells.length) throw new ContentError('There are no Word Jumper missions for this level yet.', 'empty');
    const order: (CategoryItem | SpellItem)[] = [];
    for (let i = 0; i < 2; i++) {
      if (cats[i]) order.push(cats[i]);
      if (spells[i]) order.push(spells[i]);
    }
    const missions: JumperMission[] = order.map((item) => {
      if (item.kind === 'category') {
        const words = shuffle(
          [...item.correct.map((t) => ({ text: t, correct: true })), ...item.distractors.map((t) => ({ text: t, correct: false }))],
          rng,
        ).map((w) => ({ ...w, icon: item.icons?.[w.text] ? `icon-${item.icons[w.text]}` : null }));
        return { kind: 'category', item, words };
      }
      return { kind: 'spell', item, letters: shuffle([...item.word, ...item.decoys], rng), icon: iconTexture(item.asset?.image) };
    });
    return { contentIds: order.map((i) => i.id), data: { missions }, total: missions.length };
  },
  initialPanel: () => null,
  loadScene: () => import('./JumperScene').then((m) => m.JumperScene),
};
