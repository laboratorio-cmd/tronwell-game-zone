import { describe, expect, it } from 'vitest';
import { CASE_BANKS, CHALLENGE_BANKS } from '../content';
import { CEFR_LEVELS, GAME_IDS } from '../types';
import { validateAll } from './validate';

describe('content bank', () => {
  it('has no validation issues', () => {
    const issues = validateAll({ challenges: CHALLENGE_BANKS, cases: CASE_BANKS });
    if (issues.length) console.error(issues.map((i) => `${i.id}: ${i.message}`).join('\n'));
    expect(issues).toEqual([]);
  });

  it('has a bank for every game and level', () => {
    for (const game of GAME_IDS) {
      for (const level of CEFR_LEVELS) {
        const found = game === 'english-detective'
          ? CASE_BANKS.find((b) => b.level === level)
          : CHALLENGE_BANKS.find((b) => b.game === game && b.level === level);
        expect(found, `${game} ${level}`).toBeTruthy();
      }
    }
  });

  it('has enough content to play every game at every level', () => {
    const counts: string[] = [];
    for (const bank of CHALLENGE_BANKS) {
      counts.push(`${bank.game} ${bank.level}: ${bank.items.length}`);
      expect(bank.items.length, `${bank.game} ${bank.level}`).toBeGreaterThanOrEqual(12);
    }
    for (const bank of CASE_BANKS) {
      counts.push(`english-detective ${bank.level}: ${bank.items.length} case(s)`);
      expect(bank.items.length, `english-detective ${bank.level}`).toBeGreaterThanOrEqual(1);
    }
    console.info(counts.join('\n'));
  });
});
