import { describe, expect, it } from 'vitest';
import { CASE_BANKS } from '../education/content';
import { seededRng } from '../education/questionEngine';
import { CEFR_LEVELS, GAME_IDS, type DetectiveCase } from '../education/types';
import {
  accuse, answerQuestion, currentQuestion, examine, initialCaseState, isSolved, missingFor, prove, questionReady, startInvestigation,
  visibleEvidence, type CaseState,
} from './english-detective/caseMachine';
import { GAMES, getGame } from './registry';
import { ASSETS, evidenceTexture, lookTexture } from './shared/pixel/assets';
import { nextLetterState, startSpelling } from './word-jumper/spelling';
import { GROUND_Y, LEVEL_H, TILE, buildLevel } from './word-jumper/levelGen';

describe('game registry', () => {
  it('registers the four games with unique ids', () => {
    expect(GAMES.map((g) => g.id).sort()).toEqual([...GAME_IDS].sort());
    expect(getGame('tense-racer')?.title).toBe('Tense Racer');
    expect(getGame('nope')).toBeNull();
  });

  it('builds a playable session for every game at every level', () => {
    for (const g of GAMES) {
      for (const level of CEFR_LEVELS) {
        const s = g.buildSession(level, { recent: [], rng: seededRng(7) });
        expect(s.total, `${g.id} ${level}`).toBeGreaterThan(0);
        expect(s.contentIds.length, `${g.id} ${level}`).toBeGreaterThan(0);
        expect(new Set(s.contentIds).size).toBe(s.contentIds.length);
      }
    }
  });

  it('only references textures that exist in the asset manifest', () => {
    for (const g of GAMES) {
      expect(ASSETS[g.cabinet.sprite], g.cabinet.sprite).toBeTruthy();
      expect(ASSETS[g.cabinet.background], g.cabinet.background).toBeTruthy();
    }
    for (const bank of CASE_BANKS) {
      for (const c of bank.items) {
        for (const s of c.suspects) expect(ASSETS[lookTexture(s.look)], `${c.id} ${s.look}`).toBeTruthy();
        for (const e of c.evidence) expect(ASSETS[evidenceTexture(e.sprite)], `${c.id} ${e.sprite}`).toBeTruthy();
      }
    }
  });

  it('prefers content the student has not practised recently', () => {
    const g = getGame('grammar-blaster')!;
    const first = g.buildSession('A1', { recent: [], rng: seededRng(1) });
    const second = g.buildSession('A1', { recent: first.contentIds, rng: seededRng(2) });
    expect(second.contentIds.some((id) => first.contentIds.includes(id))).toBe(false);
  });
});

/** Plays a case like a careful student: examine what each question needs, then answer. */
function playCase(c: DetectiveCase, pick: (correct: number, n: number) => number) {
  let s: CaseState = startInvestigation(initialCaseState());
  let guard = 0;
  while (s.phase === 'investigate' && guard++ < 100) {
    const q = currentQuestion(c, s);
    if (!q) break;
    const missing = missingFor(s, q);
    if (missing.length) {
      for (const id of missing) s = examine(c, s, id);
      expect(questionReady(s, q), `${c.id} ${q.id} should open after examining ${missing.join(', ')}`).toBe(true);
      continue;
    }
    const step = answerQuestion(c, s, q.id, pick(q.answer, q.choices.length));
    expect(step, `${c.id} ${q.id}`).not.toBeNull();
    s = step!.state;
    for (const id of step!.revealed) expect(visibleEvidence(c, s).some((e) => e.id === id)).toBe(true);
  }
  expect(s.phase).toBe('accuse');
  s = accuse(c, s, pick(c.solution.answer, c.solution.choices.length))!.state;
  s = prove(c, s, pick(c.proof.answer, c.proof.choices.length))!.state;
  expect(s.phase).toBe('closed');
  return s;
}

describe('English Detective case machine', () => {
  const cases = CASE_BANKS.flatMap((b) => b.items);

  it('has at least one complete case per level', () => {
    for (const level of CEFR_LEVELS) expect(cases.some((c) => c.level === level)).toBe(true);
  });

  it.each(cases.map((c) => [c.id, c] as const))('%s can be solved by reading the clues', (_id, c) => {
    const s = playCase(c, (correct) => correct);
    expect(isSolved(c, s)).toBe(true);
    // every piece of evidence ends up visible
    expect(visibleEvidence(c, s).length).toBe(c.evidence.length);
  });

  it.each(cases.map((c) => [c.id, c] as const))('%s still finishes (unsolved) with wrong answers', (_id, c) => {
    const s = playCase(c, (correct, n) => (correct + 1) % n);
    expect(isSolved(c, s)).toBe(false);
  });

  it('ignores answers to questions that are not open yet', () => {
    const c = cases[0];
    const s = startInvestigation(initialCaseState());
    const q = c.questions[0];
    if (q.requires.length) expect(answerQuestion(c, s, q.id, q.answer)).toBeNull();
    expect(answerQuestion(c, s, 'not-a-question', 0)).toBeNull();
    expect(examine(c, initialCaseState(), c.suspects[0].id).examined).toEqual([]); // not before the briefing
  });

  it('does not let hidden evidence be examined before it is revealed', () => {
    const c = cases.find((x) => x.evidence.some((e) => e.hidden))!;
    const hidden = c.evidence.find((e) => e.hidden)!;
    const s = examine(c, startInvestigation(initialCaseState()), hidden.id);
    expect(s.examined).not.toContain(hidden.id);
  });
});

describe('Word Jumper spelling', () => {
  it('fills letters in order and finishes the word', () => {
    let s = startSpelling('cat');
    for (const ch of 'cat') {
      const r = nextLetterState(s, ch);
      expect(r.result).toBe('placed');
      s = r.state;
    }
    expect(s.filled.join('')).toBe('cat');
    expect(s.mistakes).toBe(0);
  });

  it('treats a later letter and a decoy differently', () => {
    const s = startSpelling('planet');
    expect(nextLetterState(s, 'n').result).toBe('later');
    expect(nextLetterState(s, 'z').result).toBe('wrong');
    expect(nextLetterState(s, 'z').state.mistakes).toBe(1);
  });

  it('handles repeated letters', () => {
    let s = startSpelling('apple');
    for (const ch of 'app') s = (nextLetterState(s, ch) as { state: typeof s }).state;
    expect(s.next).toBe(3);
    expect(nextLetterState(s, 'p').result).toBe('wrong');
  });
});

describe('Word Jumper level generator', () => {
  it('creates enough reachable spots, gates and checkpoints for every mission', () => {
    for (let seed = 1; seed < 40; seed++) {
      const counts = [7, 9, 6, 13];
      const L = buildLevel(counts, [5, 4, 6, 4], seededRng(seed));
      expect(L.spots.map((s) => s.length)).toEqual(counts);
      expect(L.gates).toHaveLength(4);
      expect(L.checkpoints).toHaveLength(4);
      for (const spots of L.spots) {
        for (const p of spots) {
          expect(p.x).toBeGreaterThan(0);
          expect(p.x).toBeLessThan(L.width);
          // never higher than the top platform + jump, never below the ground
          expect(p.y).toBeGreaterThan(GROUND_Y - 4 * TILE - 60);
          expect(p.y).toBeLessThan(GROUND_Y);
        }
        // spots are spread out so crystals never overlap
        const xs = spots.map((p) => p.x).sort((a, b) => a - b);
        for (let i = 1; i < xs.length; i++) expect(xs[i] - xs[i - 1]).toBeGreaterThanOrEqual(TILE * 2);
      }
      // gates come after their mission's spots and before the next checkpoint
      L.gates.forEach((gx, m) => {
        expect(Math.max(...L.spots[m].map((p) => p.x))).toBeLessThan(gx);
        if (m + 1 < L.checkpoints.length) expect(gx).toBeLessThan(L.checkpoints[m + 1]);
      });
      expect(L.portalX).toBeGreaterThan(L.gates[3]);
      expect(LEVEL_H).toBe(720);
    }
  });
});
