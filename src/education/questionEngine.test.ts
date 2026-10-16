import { describe, expect, it } from 'vitest';
import {
  ContentError, checkChoice, checkOrder, filledSentence, getItems, ofKind, pickItems, prepareChoice, scrambleChunks, seededRng,
} from './questionEngine';
import type { ChallengeItem, ChoiceItem, ContentBank, OrderItem } from './types';
import { validateCase, validateItem } from './validation/validate';

const choice: ChoiceItem = {
  id: 'gb-a1-900', kind: 'choice', level: 'A1', games: ['grammar-blaster'], objective: 'Present simple', category: 'present-simple',
  difficulty: 1, prompt: 'She ___ to school every day.', choices: ['go', 'goes', 'going'], answer: 1,
  feedback: 'With he/she/it in the present simple, add -s to the verb.', tags: [], status: 'draft',
};
const order: OrderItem = {
  id: 'tr-b1-900', kind: 'order', level: 'B1', games: ['tense-racer'], objective: 'Word order', category: 'word-order', difficulty: 2,
  chunks: ['She', 'has', 'already', 'finished', 'her homework'], punctuation: '.',
  alternatives: [['She', 'has', 'finished', 'her homework', 'already']],
  feedback: 'Already usually goes between has and the past participle.', tags: [], status: 'draft',
};

describe('question engine', () => {
  it('filters by game and level', () => {
    const items = getItems('grammar-blaster', 'A2');
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((i) => i.level === 'A2' && i.games.includes('grammar-blaster'))).toBe(true);
    expect(getItems('tense-racer', 'B2').every((i) => i.level === 'B2')).toBe(true);
  });

  it('skips invalid items instead of serving a broken answer key', () => {
    const broken = { ...choice, id: 'gb-a1-901', answer: 7 };
    const bank: ContentBank<ChallengeItem> = { game: 'grammar-blaster', level: 'A1', items: [choice, broken] };
    expect(validateItem(broken, bank).some((i) => /not a valid option/.test(i.message))).toBe(true);
    expect(getItems('grammar-blaster', 'A1', [bank]).map((i) => i.id)).toEqual(['gb-a1-900']);
  });

  it('fails gracefully when a level has no content', () => {
    expect(() => pickItems([], 5)).toThrow(ContentError);
    expect(() => pickItems([choice], 5, { min: 3 })).toThrow(/not enough/);
    expect(getItems('grammar-blaster', 'A1', [])).toEqual([]);
  });

  it('shuffles options but keeps the right answer', () => {
    for (let seed = 1; seed < 30; seed++) {
      const p = prepareChoice(choice, seededRng(seed));
      expect(p.options[p.correctIndex]).toBe('goes');
      expect(checkChoice(p, p.correctIndex)).toBe(true);
      expect(checkChoice(p, (p.correctIndex + 1) % 3)).toBe(false);
    }
    expect(filledSentence(choice)).toBe('She goes to school every day.');
  });

  it('checks word order, accepting listed alternatives only', () => {
    expect(checkOrder(order, ['She', 'has', 'already', 'finished', 'her homework'])).toBe(true);
    expect(checkOrder(order, ['She', 'has', 'finished', 'her homework', 'already'])).toBe(true);
    expect(checkOrder(order, ['She', 'already', 'has', 'finished', 'her homework'])).toBe(false);
    for (let seed = 1; seed < 20; seed++) expect(checkOrder(order, scrambleChunks(order, seededRng(seed)))).toBe(false);
  });

  it('picks without repeats and respects the count', () => {
    const items = ofKind(getItems('word-jumper', 'A0'), 'spell');
    const picked = pickItems(items, 5, { rng: seededRng(3) });
    expect(picked).toHaveLength(5);
    expect(new Set(picked.map((i) => i.id)).size).toBe(5);
  });
});

describe('validator', () => {
  const bank = { game: 'grammar-blaster' as const, level: 'A1' as const };
  it('reports missing fields, bad ids, level mismatches and weak feedback', () => {
    const msgs = (item: ChallengeItem, b: { game: 'grammar-blaster' | 'tense-racer' | 'word-jumper'; level: 'A1' | 'B1' } = bank) => validateItem(item, b).map((i) => i.message).join(' | ');
    expect(msgs({ ...choice, id: 'gb-a2-001' })).toMatch(/must start with "gb-a1-"/);
    expect(msgs({ ...choice, level: 'B1' })).toMatch(/does not match bank level/);
    expect(msgs({ ...choice, prompt: 'No gap here.' })).toMatch(/exactly one ___/);
    expect(msgs({ ...choice, choices: ['go', 'go', 'goes'] })).toMatch(/duplicate option/);
    expect(msgs({ ...choice, feedback: 'goes' })).toMatch(/explain why/);
    expect(msgs({ ...choice, objective: '' })).toMatch(/missing objective/);
    expect(msgs({ ...order, alternatives: [['She', 'has']] }, { game: 'tense-racer', level: 'B1' })).toMatch(/not a permutation/);
    expect(msgs({ ...order, chunks: ['she', 'has', 'gone.'] }, { game: 'tense-racer', level: 'B1' })).toMatch(/capital|punctuation/);
  });

  it('reports detective cases that cannot be completed', () => {
    const c = {
      id: 'ed-a1-99', level: 'A1', games: ['english-detective'], objective: 'x', difficulty: 1, status: 'draft', tags: [], title: 'T', scene: 'lab',
      briefing: ['A case.'],
      suspects: [{ id: 's1', name: 'A', role: 'r', look: 'robot', statement: 'Hi.' }, { id: 's2', name: 'B', role: 'r', look: 'alien', statement: 'Hi.' }],
      evidence: [
        { id: 'e1', name: 'Note', sprite: 'note', description: 'A note.', x: 0.2, y: 0.6 },
        { id: 'e2', name: 'Key', sprite: 'key', description: 'A key.', x: 0.5, y: 0.6, hidden: true },
        { id: 'e3', name: 'Cup', sprite: 'cup', description: 'A cup.', x: 0.8, y: 0.6 },
      ],
      questions: [
        { id: 'q1', prompt: 'Q?', choices: ['a', 'b'], answer: 0, feedback: 'f', requires: ['e2'], category: 'reading-detail' },
        { id: 'q2', prompt: 'Q?', choices: ['a', 'b'], answer: 5, feedback: 'f', requires: [], category: 'reading-detail' },
        { id: 'q3', prompt: 'Q?', choices: ['a', 'b'], answer: 0, feedback: 'f', requires: [], category: 'reading-detail' },
      ],
      solution: { question: 'Who?', choices: ['A', 'B'], answer: 0, explanation: 'Because.' },
      proof: { question: 'Proof?', choices: ['x', 'y'], answer: 1, explanation: 'Because.' },
    } as unknown as Parameters<typeof validateCase>[0];
    const msgs = validateCase(c, 'A1').map((i) => i.message).join(' | ');
    expect(msgs).toMatch(/requires "e2" before it is revealed/);
    expect(msgs).toMatch(/invalid answer index/);
    expect(msgs).toMatch(/never revealed/);
  });
});
