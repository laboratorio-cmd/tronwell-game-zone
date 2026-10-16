import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CefrLevel } from '../education/types';
import { audio } from '../games/shared/audio';
import { chooseLevel, resolveLevel, type StudentLevel } from '../services/level';
import { DeviceProgressRepository } from '../services/progress/repository';
import { ProgressService } from '../services/progress/progressService';
import type { ProfileData } from '../services/progress/types';
import { loadSettings, prefersReducedMotion, saveSettings, type Settings } from '../services/settings';
import { openDeviceStorage, type DeviceStorage } from '../services/storage';

interface AppState {
  storage: DeviceStorage;
  progress: ProgressService;
  profile: ProfileData | null;
  level: StudentLevel | null;
  setLevel: (cefr: CefrLevel, portalId?: string) => void;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  reducedMotion: boolean;
}

const Ctx = createContext<AppState | null>(null);

/** Services are created once per page load. */
const storage = openDeviceStorage();
const progress = new ProgressService(new DeviceProgressRepository(storage.store, storage.persistent));

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [level, setLevelState] = useState<StudentLevel | null>(() => resolveLevel(window.location.search, storage.store));
  const [settings, setSettings] = useState<Settings>(() => loadSettings(storage.store));
  const [systemReduced, setSystemReduced] = useState(() => prefersReducedMotion({ ...settings, motion: 'system' }));

  useEffect(() => {
    let alive = true;
    progress.init().then((p) => alive && setProfile(p));
    const off = progress.subscribe((p) => setProfile(p));
    return () => {
      alive = false;
      off();
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const on = () => setSystemReduced(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);

  useEffect(() => {
    audio.configure({ volume: settings.volume, muted: settings.muted, music: settings.music });
  }, [settings]);

  const reducedMotion = settings.motion === 'system' ? systemReduced : settings.motion === 'reduced';
  useEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', reducedMotion);
  }, [reducedMotion]);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((s) => {
      const next = { ...s, ...patch };
      saveSettings(storage.store, next);
      return next;
    });
  }, []);

  const setLevel = useCallback((cefr: CefrLevel, portalId?: string) => {
    setLevelState(chooseLevel(storage.store, cefr, portalId));
  }, []);

  const value = useMemo<AppState>(
    () => ({ storage, progress, profile, level, setLevel, settings, updateSettings, reducedMotion }),
    [profile, level, setLevel, settings, updateSettings, reducedMotion],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp outside AppProvider');
  return v;
}
