import type { GameId } from '../education/types';
import { englishDetective } from './english-detective/definition';
import { grammarBlaster } from './grammar-blaster/definition';
import type { GameDefinition } from './shared/types';
import { tenseRacer } from './tense-racer/definition';
import { wordJumper } from './word-jumper/definition';

/** The four Game Zone games, in lobby order. Each game registers itself here. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GAMES: GameDefinition<any, any>[] = [grammarBlaster, wordJumper, tenseRacer, englishDetective];

export function getGame(id: string | undefined) {
  return GAMES.find((g) => g.id === id) ?? null;
}

export function gameTitle(id: GameId) {
  return getGame(id)?.title ?? id;
}
