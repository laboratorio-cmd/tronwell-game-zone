import type { ChallengeItem, ContentBank, DetectiveCase } from '../types';

import { bank as gbA0 } from './grammar-blaster/a0';
import { bank as gbA1 } from './grammar-blaster/a1';
import { bank as gbA2 } from './grammar-blaster/a2';
import { bank as gbB1 } from './grammar-blaster/b1';
import { bank as gbB2 } from './grammar-blaster/b2';
import { bank as wjA0 } from './word-jumper/a0';
import { bank as wjA1 } from './word-jumper/a1';
import { bank as wjA2 } from './word-jumper/a2';
import { bank as wjB1 } from './word-jumper/b1';
import { bank as wjB2 } from './word-jumper/b2';
import { bank as trA0 } from './tense-racer/a0';
import { bank as trA1 } from './tense-racer/a1';
import { bank as trA2 } from './tense-racer/a2';
import { bank as trB1 } from './tense-racer/b1';
import { bank as trB2 } from './tense-racer/b2';
import { bank as edA0 } from './english-detective/a0';
import { bank as edA1 } from './english-detective/a1';
import { bank as edA2 } from './english-detective/a2';
import { bank as edB1 } from './english-detective/b1';
import { bank as edB2 } from './english-detective/b2';

/** All gap-fill, ordering, category and spelling banks, one per game and level. */
export const CHALLENGE_BANKS: ContentBank<ChallengeItem>[] = [
  gbA0, gbA1, gbA2, gbB1, gbB2,
  wjA0, wjA1, wjA2, wjB1, wjB2,
  trA0, trA1, trA2, trB1, trB2,
];

/** Detective cases, one bank per level. */
export const CASE_BANKS: ContentBank<DetectiveCase>[] = [edA0, edA1, edA2, edB1, edB2];
