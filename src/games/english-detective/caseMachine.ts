import type { CaseQuestion, DetectiveCase, Evidence, Suspect } from '../../education/types';

/**
 * Pure state machine for a detective case. The Phaser scene draws it, the React panel
 * shows it; both only call these functions, so the case logic is fully testable.
 */
export interface CaseState {
  phase: 'briefing' | 'investigate' | 'accuse' | 'proof' | 'closed';
  examined: string[];
  revealed: string[];
  /** question id -> chosen option index (first and only attempt) */
  answers: Record<string, number>;
  solution: number | null;
  proof: number | null;
}

export const initialCaseState = (): CaseState => ({
  phase: 'briefing',
  examined: [],
  revealed: [],
  answers: {},
  solution: null,
  proof: null,
});

export function startInvestigation(s: CaseState): CaseState {
  return s.phase === 'briefing' ? { ...s, phase: 'investigate' } : s;
}

export function visibleEvidence(c: DetectiveCase, s: CaseState): Evidence[] {
  return c.evidence.filter((e) => !e.hidden || s.revealed.includes(e.id));
}

export function findThing(c: DetectiveCase, id: string): { kind: 'suspect'; thing: Suspect } | { kind: 'evidence'; thing: Evidence } | null {
  const sp = c.suspects.find((x) => x.id === id);
  if (sp) return { kind: 'suspect', thing: sp };
  const ev = c.evidence.find((x) => x.id === id);
  return ev ? { kind: 'evidence', thing: ev } : null;
}

export function isVisible(c: DetectiveCase, s: CaseState, id: string) {
  return c.suspects.some((x) => x.id === id) || visibleEvidence(c, s).some((e) => e.id === id);
}

/** Marks a suspect or visible clue as examined. Unknown or hidden ids are ignored. */
export function examine(c: DetectiveCase, s: CaseState, id: string): CaseState {
  if (s.phase === 'briefing' || s.phase === 'closed' || !isVisible(c, s, id) || s.examined.includes(id)) return s;
  return { ...s, examined: [...s.examined, id] };
}

/** The next unanswered question (questions open in order), or null when all are answered. */
export function currentQuestion(c: DetectiveCase, s: CaseState): CaseQuestion | null {
  return c.questions.find((q) => s.answers[q.id] === undefined) ?? null;
}

/** Things the player still has to examine before `q` opens. */
export function missingFor(s: CaseState, q: CaseQuestion): string[] {
  return q.requires.filter((id) => !s.examined.includes(id));
}

export function questionReady(s: CaseState, q: CaseQuestion) {
  return s.phase === 'investigate' && missingFor(s, q).length === 0;
}

export interface AnswerStep {
  state: CaseState;
  correct: boolean;
  revealed: string[];
}

/** Answers the current question. Wrong answers still move the case on (the explanation is shown). */
export function answerQuestion(c: DetectiveCase, s: CaseState, questionId: string, choice: number): AnswerStep | null {
  const q = currentQuestion(c, s);
  if (!q || q.id !== questionId || !questionReady(s, q) || !Number.isInteger(choice) || choice < 0 || choice >= q.choices.length) return null;
  const revealed = (q.reveals ?? []).filter((id) => !s.revealed.includes(id));
  const answers = { ...s.answers, [q.id]: choice };
  const done = c.questions.every((x) => answers[x.id] !== undefined);
  return {
    state: { ...s, answers, revealed: [...s.revealed, ...revealed], phase: done ? 'accuse' : s.phase },
    correct: choice === q.answer,
    revealed,
  };
}

export function accuse(c: DetectiveCase, s: CaseState, choice: number): { state: CaseState; correct: boolean } | null {
  if (s.phase !== 'accuse' || choice < 0 || choice >= c.solution.choices.length) return null;
  return { state: { ...s, solution: choice, phase: 'proof' }, correct: choice === c.solution.answer };
}

export function prove(c: DetectiveCase, s: CaseState, choice: number): { state: CaseState; correct: boolean } | null {
  if (s.phase !== 'proof' || choice < 0 || choice >= c.proof.choices.length) return null;
  return { state: { ...s, proof: choice, phase: 'closed' }, correct: choice === c.proof.answer };
}

export function isSolved(c: DetectiveCase, s: CaseState) {
  return s.phase === 'closed' && s.solution === c.solution.answer && s.proof === c.proof.answer;
}

export function nameOf(c: DetectiveCase, id: string) {
  const t = findThing(c, id);
  return t ? t.thing.name : id;
}
