import { useState } from 'react';
import { useApp } from '../../app/AppContext';
import { Modal } from '../../components/Modal';
import { levelLabel, PORTAL_LEVELS } from '../../education/levels';
import { audio } from '../../games/shared/audio';
import type { Settings } from '../../services/settings';

const SOURCE_TEXT = {
  link: 'set by your teacher’s link',
  portal: 'from your Practice Zone placement test',
  chosen: 'chosen on this device',
} as const;

export function SettingsDialog({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings, level, setLevel } = useApp();
  const [changing, setChanging] = useState(false);
  const set = (patch: Partial<Settings>) => {
    updateSettings(patch);
    audio.unlock();
    setTimeout(() => audio.sfx('click'), 30);
  };

  return (
    <Modal title="Settings" onClose={onClose}>
      <h3>Sound</h3>
      <div className="field">
        <span id="snd">Sound effects</span>
        <div className="seg" role="group" aria-labelledby="snd">
          <button aria-pressed={!settings.muted} onClick={() => set({ muted: false })}>On</button>
          <button aria-pressed={settings.muted} onClick={() => set({ muted: true })}>Off</button>
        </div>
      </div>
      <div className="field">
        <label htmlFor="vol">Volume</label>
        <input id="vol" type="range" min={0} max={1} step={0.1} value={settings.volume} onChange={(e) => set({ volume: Number(e.target.value) })} />
      </div>
      <div className="field">
        <span id="mus">Arcade music</span>
        <div className="seg" role="group" aria-labelledby="mus">
          <button aria-pressed={settings.music} onClick={() => set({ music: true })}>On</button>
          <button aria-pressed={!settings.music} onClick={() => set({ music: false })}>Off</button>
        </div>
      </div>

      <h3>Motion</h3>
      <div className="field">
        <span id="mot">Animations and screen shake</span>
        <div className="seg" role="group" aria-labelledby="mot">
          <button aria-pressed={settings.motion === 'system'} onClick={() => set({ motion: 'system' })}>Auto</button>
          <button aria-pressed={settings.motion === 'reduced'} onClick={() => set({ motion: 'reduced' })}>Less</button>
          <button aria-pressed={settings.motion === 'full'} onClick={() => set({ motion: 'full' })}>Full</button>
        </div>
      </div>

      <h3>Level</h3>
      {level && (
        <p className="lead" style={{ marginBottom: 8 }}>
          <b style={{ color: 'var(--text)' }}>{levelLabel(level.cefr, level.portalId)}</b> — {SOURCE_TEXT[level.source]}.
        </p>
      )}
      {!changing ? (
        <button className="btn ghost small" onClick={() => setChanging(true)}>Change level</button>
      ) : (
        <>
          <p className="hint">Only change this if your teacher says so. Your progress is kept.</p>
          <div className="level-grid">
            {PORTAL_LEVELS.map((p) => (
              <button
                key={p.id}
                className={`btn small ${level?.portalId === p.id ? 'cyan' : 'ghost'}`}
                onClick={() => {
                  setLevel(p.cefr, p.id);
                  setChanging(false);
                }}
              >
                <span>{p.name}</span>
                <small>{p.cefr}</small>
              </button>
            ))}
          </div>
        </>
      )}
      <div className="row center">
        <button className="btn yellow" onClick={onClose}>Done</button>
      </div>
    </Modal>
  );
}
