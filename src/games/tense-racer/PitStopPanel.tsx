import { useStore } from '../shared/store';
import type { GameBridge } from '../shared/types';
import type { PitPanel, RacerContent } from './definition';

/** Pit-stop sentence builder. The scene owns the state; this panel only shows it and sends taps. */
export function PitStopPanel({ bridge }: { bridge: GameBridge<RacerContent, PitPanel> }) {
  const p = useStore(bridge.panel);
  if (!p.open) return null;
  const remaining = p.chunks.map((c, i) => ({ c, i })).filter(({ i }) => !p.picked.includes(i));
  const send = (type: string, payload?: number) => bridge.channel.emit(type, payload);

  return (
    <section className="builder panel" aria-label="Pit stop: build the sentence">
      <div className="hint" style={{ marginBottom: 6, fontWeight: 800 }}>
        PIT STOP · {p.instruction} Tap the words in order{p.result ? '' : ' (keys 1–9, Backspace to undo)'}.
      </div>
      <div className="sentence" aria-live="polite">
        {p.picked.length === 0 && <span className="hint">Your sentence appears here…</span>}
        {p.picked.map((i, k) => (
          <button key={i} className="word placed" disabled={!!p.result} onClick={() => k === p.picked.length - 1 && send('pit-undo')} aria-label={`${p.chunks[i]} (tap the last word to remove it)`}>
            {p.chunks[i]}
          </button>
        ))}
        {p.picked.length === p.chunks.length && <b style={{ fontSize: 20 }}>{p.punctuation}</b>}
      </div>
      {!p.result ? (
        <>
          <div className="bank">
            {remaining.map(({ c, i }, n) => (
              <button key={i} className="word" onClick={() => send('pit-pick', i)} autoFocus={n === 0 && p.picked.length === 0}>
                <kbd>{n + 1}</kbd>
                {c}
              </button>
            ))}
          </div>
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn ghost small" onClick={() => send('pit-undo')} disabled={!p.picked.length}>↶ Undo</button>
            <button className="btn ghost small" onClick={() => send('pit-clear')} disabled={!p.picked.length}>Clear</button>
          </div>
        </>
      ) : (
        <div className="row" style={{ alignItems: 'center', marginTop: 10 }}>
          <span style={{ fontWeight: 900, color: p.result === 'correct' ? 'var(--good)' : '#ff8b99' }}>
            {p.result === 'correct' ? '✔ Correct! Turbo ready.' : `✗ The right order: ${p.answer}`}
          </span>
          <button className="btn yellow" onClick={() => send('pit-continue')} autoFocus>Continue ▶</button>
        </div>
      )}
    </section>
  );
}
