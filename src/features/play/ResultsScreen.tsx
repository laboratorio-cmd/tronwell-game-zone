import { PixelSprite } from '../../components/PixelSprite';
import { SKILL_CATEGORIES, type SkillCategory } from '../../education/types';
import type { GameDefinition } from '../../games/shared/types';
import type { CompletionOutcome } from '../../services/progress/progressService';
import { accuracyOf } from '../../services/progress/scoring';
import type { GameResult } from '../../services/progress/types';
import { GapText } from './Hud';

interface Props {
  def: GameDefinition<unknown, unknown>;
  result: GameResult;
  completion: CompletionOutcome | null;
  saveError?: string;
  onAgain: () => void;
  onBack: () => void;
}

export function ResultsScreen({ def, result, completion, saveError, onAgain, onBack }: Props) {
  const acc = Math.round(accuracyOf(result.correct, result.incorrect) * 100);
  const total = result.correct + result.incorrect;
  const title = acc >= 90 ? 'OUTSTANDING!' : acc >= 70 ? 'GREAT FLYING!' : acc >= 40 ? 'GOOD MISSION!' : 'MISSION COMPLETE';
  const line = def.resultLine?.(result.meta) ?? null;
  const stars = total === 0 ? 1 : acc >= 90 ? 3 : acc >= 60 ? 2 : 1;
  const mistakes = result.answers.filter((a) => !a.correct);
  const areas = [...new Set(mistakes.map((m) => m.category))] as SkillCategory[];

  return (
    <div className="overlay">
      <section className="card panel" aria-labelledby="res-title" style={{ width: 'min(760px, 100%)' }}>
        <div className="stars-row" aria-label={`${stars} of 3 stars`}>
          {[0, 1, 2].map((i) => (
            <PixelSprite key={i} sprite="ui-star" className={i < stars ? '' : 'off'} />
          ))}
        </div>
        <h2 id="res-title" style={{ textAlign: 'center' }}>{title}</h2>
        {line && <p className="lead" style={{ textAlign: 'center' }}>{line}</p>}
        {completion?.personalBest && completion.previousBest > 0 && <p className="lead" style={{ color: 'var(--orange)' }}>★ New personal best! (before: {completion.previousBest.toLocaleString('en')})</p>}

        <div className="stats">
          <div className="stat"><small>Score</small><b>{result.score.toLocaleString('en')}</b></div>
          <div className="stat"><small>Correct</small><b>{result.correct}/{total}</b></div>
          <div className="stat"><small>Accuracy</small><b>{total ? `${acc}%` : '—'}</b></div>
          <div className="stat"><small>Best combo</small><b>{result.bestCombo}</b></div>
        </div>

        {completion ? (
          <>
            <h3>Rewards</h3>
            <div className="rewards">
              {completion.rewards.lines.map((l) => (
                <div key={l.label}>
                  <span>{l.label}</span>
                  <span><span className="xp">+{l.xp} XP</span>{l.coins ? <span className="coins"> · +{l.coins} coins</span> : null}</span>
                </div>
              ))}
              <div>
                <b>Total</b>
                <b><span className="xp">+{completion.rewards.xp} XP</span> · <span className="coins">+{completion.rewards.coins} coins</span></b>
              </div>
            </div>
            {completion.achievements.length > 0 && (
              <>
                <h3>Achievement unlocked!</h3>
                <div className="badges">
                  {completion.achievements.map((a) => (
                    <div key={a.id} className="badge new" style={{ '--c': a.color } as React.CSSProperties}>
                      <span className="gem" />
                      <span><b>{a.title}</b><br /><small>{a.description}</small></span>
                    </div>
                  ))}
                </div>
              </>
            )}
            <p className={`save-status ${completion.saved.ok ? 'ok' : 'warn'}`} role="status">
              {completion.saved.ok ? '✔ Saved on this device.' : `⚠ ${completion.saved.error ?? 'Not saved.'}`}
            </p>
          </>
        ) : saveError ? (
          <p className="save-status warn" role="alert">⚠ Your result could not be saved: {saveError}</p>
        ) : (
          <p className="save-status" role="status">Saving…</p>
        )}

        <h3>What you practised</h3>
        {total === 0 ? (
          <p className="hint">No answers this time.</p>
        ) : (
          <ul className="review">
            {result.answers.map((a) => (
              <li key={a.itemId} className={a.correct ? 'ok' : 'no'}>
                <span className="mark" aria-label={a.correct ? 'Correct' : 'Incorrect'}>{a.correct ? '✓' : '✗'}</span>
                <span>
                  <GapText text={a.prompt} />
                  <br />
                  {!a.correct && a.given && <span>You chose: {a.given} · </span>}
                  <span className="ans">{a.expected}</span>
                  {!a.correct && <div className="why">{a.feedback}</div>}
                </span>
              </li>
            ))}
          </ul>
        )}
        {areas.length > 0 && (
          <p className="hint" style={{ marginTop: 10 }}>
            Practise again: {areas.map((c) => SKILL_CATEGORIES[c]).join(' · ')}
          </p>
        )}

        <div className="row center">
          <button className="btn yellow big" onClick={onAgain} autoFocus>↻ Play again</button>
          <button className="btn ghost" onClick={onBack}>Back to arcade</button>
        </div>
      </section>
    </div>
  );
}
