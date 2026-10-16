import { useApp } from '../../app/AppContext';
import { PORTAL_LEVELS } from '../../education/levels';

/**
 * Shown only when no level is known: no teacher link, no placement result from the
 * Tronwell Kids Practice Zone and no earlier choice on this device.
 */
export function LevelGate() {
  const { setLevel } = useApp();
  return (
    <main className="page" style={{ maxWidth: 760 }}>
      <h1 className="logo" style={{ textAlign: 'center', margin: '18px 0 22px' }}>
        <span className="l1">TRONWELL <em>KIDS</em></span>
        <span className="l2">GAME ZONE</span>
      </h1>
      <section className="panel card" aria-labelledby="lv-title">
        <h2 id="lv-title">Which Tronwell Kids level are you in?</h2>
        <p className="lead">The games use your class level. If you are not sure, ask your teacher — they can also send you a link that sets it for you.</p>
        <div className="level-grid">
          {PORTAL_LEVELS.map((p) => (
            <button key={p.id} className="btn ghost" onClick={() => setLevel(p.cefr, p.id)}>
              <span>{p.name}</span>
              <small>Level {p.cefr}</small>
            </button>
          ))}
        </div>
        <p className="hint" style={{ marginTop: 16 }}>You can change this later in Settings.</p>
      </section>
    </main>
  );
}
