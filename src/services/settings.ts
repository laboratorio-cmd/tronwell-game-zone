import { readJson, writeJson, type KeyValueStore } from './storage';

export interface Settings {
  muted: boolean;
  /** 0–1 */
  volume: number;
  music: boolean;
  /** 'system' follows the device's "reduce motion" setting. */
  motion: 'system' | 'reduced' | 'full';
}

export const SETTINGS_KEY = 'twgz1_settings';
export const DEFAULT_SETTINGS: Settings = { muted: false, volume: 0.7, music: true, motion: 'system' };

export function loadSettings(store: KeyValueStore): Settings {
  const s = readJson<Partial<Settings>>(store, SETTINGS_KEY, {});
  return {
    muted: typeof s.muted === 'boolean' ? s.muted : DEFAULT_SETTINGS.muted,
    volume: typeof s.volume === 'number' ? Math.min(1, Math.max(0, s.volume)) : DEFAULT_SETTINGS.volume,
    music: typeof s.music === 'boolean' ? s.music : DEFAULT_SETTINGS.music,
    motion: s.motion === 'reduced' || s.motion === 'full' ? s.motion : 'system',
  };
}

export function saveSettings(store: KeyValueStore, s: Settings) {
  writeJson(store, SETTINGS_KEY, s);
}

export function prefersReducedMotion(s: Settings): boolean {
  if (s.motion !== 'system') return s.motion === 'reduced';
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}
