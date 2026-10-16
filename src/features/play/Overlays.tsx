import { PixelSprite } from '../../components/PixelSprite';
import { levelLabel } from '../../education/levels';
import type { CefrLevel } from '../../education/types';
import type { GameDefinition } from '../../games/shared/types';

export function StartScreen({ def, cefr, portalId, onStart, onBack }: { def: GameDefinition<unknown, unknown>; cefr: CefrLevel; portalId?: string; onStart: () => void; onBack: () => void }) {
  return (
    <div className="overlay">
      <section className="card panel" aria-labelledby="start-title" style={{ '--accent': def.accent } as React.CSSProperties}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <PixelSprite sprite={def.cabinet.sprite} frame={def.cabinet.frame} scale={5} />
          <div>
            <h2 id="start-title">{def.title.toUpperCase()}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span className="chip">{def.genre}</span>
              <span className="chip">{levelLabel(cefr, portalId)}</span>
            </div>
          </div>
        </div>
        <h3>How to play</h3>
        <ol className="howto">
          {def.howTo.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ol>
        <h3>Controls</h3>
        <table className="controls">
          <thead>
            <tr>
              <th scope="col">Action</th>
              <th scope="col">Keyboard / mouse</th>
              <th scope="col">Touch</th>
            </tr>
          </thead>
          <tbody>
            {def.controls.map((c) => (
              <tr key={c.action}>
                <td><b>{c.action}</b></td>
                <td>{c.keyboard}</td>
                <td>{c.touch}</td>
              </tr>
            ))}
            <tr>
              <td><b>Pause</b></td>
              <td>Esc or P</td>
              <td>❚❚ button</td>
            </tr>
          </tbody>
        </table>
        <div className="row center">
          <button className="btn yellow big" onClick={onStart} autoFocus>▶ START MISSION</button>
          <button className="btn ghost" onClick={onBack}>Back to arcade</button>
        </div>
      </section>
    </div>
  );
}

export function PauseOverlay({ onResume, onRestart, onQuit, onSettings, hasAnswers }: { onResume: () => void; onRestart: () => void; onQuit: () => void; onSettings: () => void; hasAnswers: boolean }) {
  return (
    <div className="overlay">
      <section className="card panel" aria-labelledby="pause-title" role="dialog" aria-modal="true" style={{ maxWidth: 440, textAlign: 'center' }}>
        <h2 id="pause-title">PAUSED</h2>
        <p className="lead">Take a break. Your game is waiting.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button className="btn yellow big" onClick={onResume} autoFocus>▶ Resume</button>
          <button className="btn ghost" onClick={onRestart}>↻ Restart</button>
          <button className="btn ghost" onClick={onSettings}>Settings</button>
          <button className="btn ghost" onClick={onQuit}>Quit to arcade</button>
        </div>
        {hasAnswers && <p className="hint" style={{ marginTop: 12 }}>If you quit, you keep the XP for your correct answers.</p>}
      </section>
    </div>
  );
}

export function ErrorCard({ message, onRetry, onBack }: { message: string; onRetry: () => void; onBack: () => void }) {
  return (
    <div className="overlay">
      <section className="card panel" role="alert" style={{ maxWidth: 480, textAlign: 'center' }}>
        <h2>Houston, we have a problem</h2>
        <p className="lead">{message}</p>
        <div className="row center">
          <button className="btn yellow" onClick={onRetry}>Try again</button>
          <button className="btn ghost" onClick={onBack}>Back to arcade</button>
        </div>
      </section>
    </div>
  );
}
