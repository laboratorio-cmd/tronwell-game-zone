import { useSyncExternalStore } from 'react';

/** Tiny external store: games write, React components subscribe (no re-render of the game screen). */
export class Store<T> {
  private listeners = new Set<() => void>();

  constructor(private state: T) {}

  get = (): T => this.state;

  set(patch: Partial<T> | ((s: T) => Partial<T>)) {
    const p = typeof patch === 'function' ? patch(this.state) : patch;
    this.state = { ...this.state, ...p };
    this.listeners.forEach((l) => l());
  }

  replace(next: T) {
    this.state = next;
    this.listeners.forEach((l) => l());
  }

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };
}

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

type Handler = (payload: unknown) => void;

/** Two-way messages between a Phaser scene and its React panel. */
export class Channel {
  private map = new Map<string, Set<Handler>>();

  on<P>(type: string, fn: (payload: P) => void) {
    const set = this.map.get(type) ?? new Set<Handler>();
    set.add(fn as Handler);
    this.map.set(type, set);
    return () => {
      set.delete(fn as Handler);
    };
  }

  emit(type: string, payload?: unknown) {
    this.map.get(type)?.forEach((fn) => fn(payload));
  }

  clear() {
    this.map.clear();
  }
}
