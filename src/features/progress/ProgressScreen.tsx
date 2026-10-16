import { useMemo, useState } from 'react';
import { useApp } from '../../app/AppContext';
import { navigate } from '../../app/router';
import { gameTitle } from '../../games/registry';
import { summarize } from '../../services/progress/stats';
import { PilotCard } from '../lobby/Lobby';

const pct = (v: number | null) => (v === null ? '—' : `${Math.round(v * 100)}%`);

export function ProgressScreen({ onSettings }: { onSettings: () => void }) {
  const { profile, progress, storage } = useApp();
  const s = useMemo(() => (profile ? summarize(profile) : null), [profile]);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <main className="page">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <button className="btn ghost small" onClick={() => navigate('#/')}>← Arcade</button>
        <h1 className="logo" style={{ fontSize: 'clamp(18px, 4vw, 28px)', color: 'var(--yellow)' }}>MY PROGRESS</h1>
        <button className="btn ghost small" onClick={onSettings}>Settings</button>
      </div>

      {!s ? (
        <p>Loading…</p>
      ) : (
        <>
          <div className="grid-2">
            <PilotCard />
            <section className="panel" style={{ padding: 16 }}>
              <div className="stats" style={{ margin: 0 }}>
                <div className="stat"><small>Games played</small><b>{s.gamesPlayed}</b></div>
                <div className="stat"><small>Finished</small><b>{s.gamesCompleted}</b></div>
                <div className="stat"><small>Streak</small><b>{s.streak}d</b></div>
              </div>
            </section>
          </div>

          <div className="grid-2" style={{ marginTop: 16 }}>
            <section className="panel" style={{ padding: 16 }} aria-labelledby="by-game">
              <h2 id="by-game" className="pixel-font" style={{ fontSize: 13, color: 'var(--cyan)', marginTop: 0 }}>BY GAME</h2>
              <table className="table">
                <thead>
                  <tr><th scope="col">Game</th><th scope="col">Played</th><th scope="col">Best</th><th scope="col">Accuracy</th></tr>
                </thead>
                <tbody>
                  {s.byGame.map((g) => (
                    <tr key={g.gameId}>
                      <td>{gameTitle(g.gameId)}</td>
                      <td className="num">{g.played}</td>
                      <td className="num">{g.bestScore ? `${g.bestScore.toLocaleString('en')} (${g.bestLevel})` : '—'}</td>
                      <td className="num">{pct(g.accuracy)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="panel" style={{ padding: 16 }} aria-labelledby="practise">
              <h2 id="practise" className="pixel-font" style={{ fontSize: 13, color: 'var(--cyan)', marginTop: 0 }}>PRACTISE AGAIN</h2>
              {s.practise.length === 0 ? (
                <p className="hint">Play a few games and we will show the areas where you made the most mistakes.</p>
              ) : (
                <ul className="review">
                  {s.practise.map((p) => (
                    <li key={p.category} className="no">
                      <span className="mark">!</span>
                      <span><b>{p.label}</b><br /><span className="why">{p.mistakes} mistake{p.mistakes === 1 ? '' : 's'} in your last games</span></span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className="panel" style={{ padding: 16, marginTop: 16 }} aria-labelledby="ach">
            <h2 id="ach" className="pixel-font" style={{ fontSize: 13, color: 'var(--cyan)', marginTop: 0 }}>ACHIEVEMENTS</h2>
            <div className="badges">
              {s.achievements.map((a) => (
                <div key={a.id} className={`badge ${a.unlockedAt ? '' : 'locked'}`} style={{ '--c': a.color } as React.CSSProperties}>
                  <span className="gem" />
                  <span>
                    <b>{a.title}</b>
                    <br />
                    <small>{a.unlockedAt ? `Unlocked ${new Date(a.unlockedAt).toLocaleDateString('en-GB')}` : a.description}</small>
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel" style={{ padding: 16, marginTop: 16 }} aria-labelledby="recent">
            <h2 id="recent" className="pixel-font" style={{ fontSize: 13, color: 'var(--cyan)', marginTop: 0 }}>RECENT GAMES</h2>
            {s.recent.length === 0 ? (
              <p className="hint">No games yet. Pick a cabinet in the arcade!</p>
            ) : (
              <table className="table">
                <thead>
                  <tr><th scope="col">When</th><th scope="col">Game</th><th scope="col">Level</th><th scope="col">Score</th><th scope="col">Accuracy</th><th scope="col">XP</th></tr>
                </thead>
                <tbody>
                  {s.recent.map((r) => (
                    <tr key={r.sessionId}>
                      <td>{new Date(r.completedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                      <td>{gameTitle(r.gameId)}{r.status === 'quit' ? ' (quit)' : ''}</td>
                      <td>{r.level}</td>
                      <td className="num">{r.score.toLocaleString('en')}</td>
                      <td className="num">{pct(r.correct + r.incorrect ? r.accuracy : null)}</td>
                      <td className="num">+{r.xp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <p className="save-note">
            {storage.persistent ? 'Saved in this browser on this device only.' : 'Storage is blocked in this browser: progress is not saved.'}{' '}
            {!confirmReset ? (
              <button className="btn ghost small" style={{ marginLeft: 8 }} onClick={() => setConfirmReset(true)}>Reset my progress</button>
            ) : (
              <>
                <b>Delete all XP, scores and achievements on this device?</b>{' '}
                <button className="btn small orange" onClick={() => void progress.resetProgress().then(() => setConfirmReset(false))}>Yes, reset</button>{' '}
                <button className="btn small ghost" onClick={() => setConfirmReset(false)}>Cancel</button>
              </>
            )}
          </p>
        </>
      )}
    </main>
  );
}
