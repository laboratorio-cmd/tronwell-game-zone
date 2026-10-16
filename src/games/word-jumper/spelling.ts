/** Pure spelling logic for Word Jumper (letters must be collected in order). */
export interface SpellState {
  word: string;
  filled: (string | null)[];
  next: number;
  mistakes: number;
}

export type LetterResult =
  | { result: 'placed'; state: SpellState; done: boolean }
  | { result: 'later'; state: SpellState }
  | { result: 'wrong'; state: SpellState };

export function startSpelling(word: string): SpellState {
  return { word, filled: Array(word.length).fill(null), next: 0, mistakes: 0 };
}

/**
 * - the next letter of the word: placed in its slot;
 * - a letter that appears later in the word: not collected, counts as a mistake;
 * - a letter that is not in the rest of the word: a mistake, and the block is used up.
 */
export function nextLetterState(s: SpellState, letter: string): LetterResult {
  const ch = letter.toLowerCase();
  if (s.next >= s.word.length) return { result: 'wrong', state: s };
  if (s.word[s.next] === ch) {
    const filled = [...s.filled];
    filled[s.next] = ch;
    const state = { ...s, filled, next: s.next + 1 };
    return { result: 'placed', state, done: state.next >= s.word.length };
  }
  const state = { ...s, mistakes: s.mistakes + 1 };
  return s.word.slice(s.next + 1).includes(ch) ? { result: 'later', state } : { result: 'wrong', state };
}
