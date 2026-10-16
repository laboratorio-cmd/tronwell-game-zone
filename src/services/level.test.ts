import { describe, expect, it } from 'vitest';
import { chooseLevel, LEVEL_KEY, PORTAL_LEVEL_KEY, resolveLevel } from './level';
import { MemoryStore } from './storage';

describe('resolveLevel', () => {
  it('returns null when nothing is known (no invented level)', () => {
    expect(resolveLevel('', new MemoryStore())).toBeNull();
  });

  it('accepts Tronwell Kids level ids and CEFR codes from a teacher link', () => {
    expect(resolveLevel('?level=rocket', new MemoryStore())).toMatchObject({ cefr: 'A1', portalId: 'rocket', source: 'link' });
    expect(resolveLevel('?level=b2', new MemoryStore())).toMatchObject({ cefr: 'B2', source: 'link' });
    expect(resolveLevel('?level=GALAXY', new MemoryStore())).toMatchObject({ cefr: 'B2', portalId: 'galaxy' });
  });

  it('ignores unknown values', () => {
    expect(resolveLevel('?level=c2', new MemoryStore())).toBeNull();
  });

  it('remembers a teacher link for later visits', () => {
    const store = new MemoryStore();
    resolveLevel('?level=planet', store);
    store.setItem(PORTAL_LEVEL_KEY, JSON.stringify('tiny'));
    expect(resolveLevel('', store)).toMatchObject({ cefr: 'A2', source: 'link' });
  });

  it('reads the placement result saved by the Tronwell Kids portal', () => {
    const store = new MemoryStore();
    store.setItem(PORTAL_LEVEL_KEY, JSON.stringify('comet'));
    expect(resolveLevel('', store)).toMatchObject({ cefr: 'B1', portalId: 'comet', source: 'portal' });
  });

  it('uses a level chosen on this device until the portal has a newer result', () => {
    const store = new MemoryStore();
    store.setItem(PORTAL_LEVEL_KEY, JSON.stringify('moon'));
    chooseLevel(store, 'A2');
    expect(resolveLevel('', store)).toMatchObject({ cefr: 'A2', source: 'chosen' });
    store.setItem(PORTAL_LEVEL_KEY, JSON.stringify('galaxy'));
    expect(resolveLevel('', store)).toMatchObject({ cefr: 'B2', source: 'portal' });
  });

  it('survives corrupted stored values', () => {
    const store = new MemoryStore();
    store.setItem(LEVEL_KEY, '{oops');
    store.setItem(PORTAL_LEVEL_KEY, '42');
    expect(resolveLevel('', store)).toBeNull();
  });
});
