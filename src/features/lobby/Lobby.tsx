import { useMemo } from 'react';
import { useApp } from '../../app/AppContext';
import { navigate } from '../../app/router';
import { PixelSprite } from '../../components/PixelSprite';
import { levelLabel } from '../../education/levels';
import { GAMES } from '../../games/registry';
import { audio } from '../../games/shared/audio';
import { assetUrl } from '../../games/shared/pixel/assets';
import { summarize } from '../../services/progress/stats';

/** Link back to the Tronwell Kids Practice Zone (sibling site on the same GitHub Pages domain). */
export function portalUrl(portalId?: string) {
  return `../tronwell-kids/${portalId ? `?level=${portalId}` : ''}`;
}

export function PilotCard() {
  const { profile } = useApp();
  const s = useMemo(() => (profile ? summarize(profile) : null), [profile]);
  if (!s) return <div className="panel pilot" aria-busy="true" />;
  return (
    <section className="panel pilot" aria-label="Your pilot card">
      <div className="rank-badge">
        <PixelSprite sprite="ui-crown" style={{ width: 40 }} />
      </div>
      <div className="rank">{s.rank.name.toUpperCase()}</div>
      <div className="meter" role="progressbar" aria-label="XP to next rank" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(s.rank.progress * 100)}>
        <span style={{ width: `${Math.round(s.rank.progress * 100)}%` }} />
      </div>
      <div className="nums">
        <span><b>{s.xp}</b> XP</span>
        <span><b>{s.coins}</b> coins</span>
        <span><b>{s.streak}</b> day streak</span>
        {s.rank.next && <span>{s.rank.toNext} XP to {s.rank.next}</span>}
      </div>
    </section>
  );
}

export function Lobby({ onSettings }: { onSettings: () => void }) {
  const { level, progress, profile, storage } = useApp();
  if (!level) return null;
  void profile; // re-render when progress changes (best scores)

  return (
    <main className="page">
      <header className="lobby-head">
        <h1 className="logo">
          <span className="l1">TRONWELL <em>KIDS</em></span>
          <span className="l2">GAME ZONE</span>
        </h1>
        <PilotCard />
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <span className="level-pill" title="Your level decides which English the games use">
          <PixelSprite sprite="ui-star" style={{ width: 22 }} /> {levelLabel(level.cefr, level.portalId)}
        </span>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn ghost small" onClick={() => navigate('#/progress')}>My progress</button>
          <button className="btn ghost small" onClick={onSettings}>Settings</button>
        </div>
      </div>

      <h2 className="sr-only">Choose a game</h2>
      <div className="cabinets">
        {GAMES.map((g) => {
          const best = progress.bestScore(g.id, level.cefr);
          return (
            <article key={g.id} className="cabinet" style={{ '--accent': g.accent } as React.CSSProperties}>
              <div className="marquee">{g.title.toUpperCase()}</div>
              <div className="screen">
                <img className="bgimg" src={assetUrl(g.cabinet.background) ?? ''} alt="" aria-hidden="true" />
                <PixelSprite sprite={g.cabinet.sprite} frame={g.cabinet.frame} scale={6} className="hero" />
              </div>
              <div className="body">
                <span className="genre">{g.genre}</span>
                <p className="tagline">{g.tagline}</p>
                <div className="skills">
                  {g.skills.map((s) => (
                    <span key={s} className="chip">{s}</span>
                  ))}
                </div>
                <div className="best">
                  Best at {level.cefr}: <b>{best ? best.toLocaleString('en') : '—'}</b>
                </div>
                <button
                  className="btn yellow play"
                  onClick={() => {
                    audio.unlock();
                    audio.sfx('select');
                    navigate(`#/play/${g.id}`);
                  }}
                  aria-label={`Play ${g.title}`}
                >
                  ▶ PLAY
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="lobby-foot">
        <a className="btn ghost" href={portalUrl(level.portalId)}>← Tronwell Kids Practice Zone</a>
      </div>
      <p className="save-note">
        {storage.persistent
          ? 'Your progress is saved in this browser on this device. No account, no personal data.'
          : 'This browser is blocking storage, so your progress will be lost when you close the page.'}
      </p>
    </main>
  );
}
