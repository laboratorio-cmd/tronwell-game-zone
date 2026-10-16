import { getCases, pickItems } from '../../education/questionEngine';
import type { DetectiveCase } from '../../education/types';
import type { GameDefinition } from '../shared/types';
import { initialCaseState, type CaseState } from './caseMachine';

export interface DetectiveContent {
  case: DetectiveCase;
}

export interface DetectivePanelState {
  state: CaseState;
  /** Id of the suspect/evidence currently open in the viewer, if any. */
  viewing: string | null;
  /** Last answer feedback shown under the question. */
  lastAnswer: { correct: boolean; feedback: string; answer: string } | null;
}

export const englishDetective: GameDefinition<DetectiveContent, DetectivePanelState> = {
  id: 'english-detective',
  title: 'English Detective',
  tagline: 'Read the clues. Question the suspects. Crack the case.',
  genre: 'Mystery adventure',
  skills: ['Reading for detail', 'Inference', 'Dialogue', 'Descriptions'],
  howTo: [
    'Read the case file, then tap the suspects and the glowing clues to read them.',
    'Answer the detective questions — each right answer helps you find new evidence.',
    'When you are ready, name what happened and choose the clue that proves it.',
  ],
  controls: [
    { action: 'Examine', keyboard: 'Tab + Enter in the case notebook', touch: 'Tap people and clues' },
    { action: 'Answer', keyboard: 'Tab + Enter, or 1 2 3', touch: 'Tap an answer' },
  ],
  accent: '#B36BFF',
  cabinet: { sprite: 'ed-inspect', background: 'bg-english-detective-1' },
  music: 'detective',
  touch: 'none',
  layout: 'side',
  fixedSize: { width: 1280, height: 720 },
  progressLabel: 'Case',
  buildSession(level, { recent, rng }) {
    const [picked] = pickItems(getCases(level), 1, { recent, rng, min: 1 });
    return { contentIds: [picked.id], data: { case: picked }, total: picked.questions.length + 2 };
  },
  initialPanel: () => ({ state: initialCaseState(), viewing: null, lastAnswer: null }),
  loadScene: () => import('./DetectiveScene').then((m) => m.DetectiveScene),
  loadPanel: () => import('./DetectivePanel').then((m) => m.DetectivePanel),
  resultLine: (meta) => (meta?.solved === true ? 'Case closed: you solved the mystery!' : meta?.solved === false ? 'Case closed — read the explanation to see what really happened.' : null),
};
