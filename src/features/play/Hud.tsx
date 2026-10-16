import { Fragment } from 'react';
import { PixelSprite } from '../../components/PixelSprite';
import { useStore, type Store } from '../../games/shared/store';
import type { HudState } from '../../games/shared/types';

/** Renders text with "___" shown as a gap. */
export function GapText({ text }: { text: string }) {
  const parts = text.split('___');
  return (
    <span>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {p}
          {i < parts.length - 1 && (
            <>
              <span className="gap" aria-hidden="true" />
              <span className="sr-only">blank</span>
            </>
          )}
        </Fragment>
      ))}
    </span>
  );
}

export function HudStats({ hud }: { hud: Store<HudState> }) {
  const s = useStore(hud);
  const pct = s.progressTotal ? Math.round((s.progressDone / s.progressTotal) * 100) : 0;
  return (
    <>
      <div className="hud-box" aria-label={`Score ${s.score}`}>
        <small>SCORE</small>
        <b>{s.score.toLocaleString('en')}</b>
      </div>
      <div className={`hud-box combo ${s.combo >= 3 ? 'hot' : ''}`} aria-label={`Combo ${s.combo}`}>
        <small>COMBO</small>
        <b>{s.combo > 0 ? `${s.combo}${s.multiplier > 1 ? ` ×${s.multiplier}` : ''}` : '—'}</b>
      </div>
      {s.stat && (
        <div className="hud-box">
          <small>{s.stat.label}</small>
          <b>{s.stat.value}</b>
        </div>
      )}
      {s.lives && (
        <div className="lives" aria-label={`Shields ${s.lives.current} of ${s.lives.max}`}>
          {Array.from({ length: s.lives.max }, (_, i) => (
            <PixelSprite key={i} sprite={i < s.lives!.current ? 'ui-heart' : 'ui-heart-empty'} />
          ))}
        </div>
      )}
      <div className="progress">
        <small>{s.progressLabel}</small>
        <div className="meter" role="progressbar" aria-label="Progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>
    </>
  );
}

export function PromptPanel({ hud }: { hud: Store<HudState> }) {
  const s = useStore(hud);
  const p = s.prompt;
  const f = s.feedback;
  // Always rendered with a fixed height so the game canvas never jumps when text changes.
  return (
    <section className="prompt" aria-label="Challenge">
      {p && (
        <>
          <div className="kicker">{p.kicker}</div>
          <div className="text">
            {p.icon && <PixelSprite sprite={p.icon} scale={5} alt="picture clue" />}
            <GapText text={p.text} />
            {p.slots && (
              <span className="slots" aria-label={`Word so far: ${p.slots.letters.map((l) => l ?? 'blank').join(' ')}`}>
                {p.slots.letters.map((l, i) => (
                  <span key={i} className={i === p.slots!.next ? 'next' : ''}>{l ?? ''}</span>
                ))}
              </span>
            )}
          </div>
          {p.options && (
            <div className="opts">
              {p.options.map((o, i) => (
                <span key={o}><kbd>{i + 1}</kbd>{o}</span>
              ))}
            </div>
          )}
        </>
      )}
      <div className="feedback-slot" role="status" aria-live="polite">
        {f && (
          <div key={f.id} className={`feedback ${f.kind}`}>
            <span className="f-title">{f.title}</span>
            {f.answer && <span className="f-answer">{f.answer} </span>}
            {f.text && <span>{f.text}</span>}
          </div>
        )}
      </div>
      {s.timer !== null && <div className="timer-bar" style={{ width: `${Math.round(s.timer * 100)}%` }} aria-hidden="true" />}
    </section>
  );
}
