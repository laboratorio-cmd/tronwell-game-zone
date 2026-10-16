import { PixelSprite } from '../../components/PixelSprite';
import { useStore } from '../shared/store';
import { evidenceTexture, lookTexture } from '../shared/pixel/assets';
import type { GameBridge } from '../shared/types';
import { currentQuestion, findThing, isSolved, missingFor, nameOf, questionReady, visibleEvidence } from './caseMachine';
import type { DetectiveContent, DetectivePanelState } from './definition';

/** Case notebook: everything in the room is also reachable here with the keyboard. */
export function DetectivePanel({ bridge }: { bridge: GameBridge<DetectiveContent, DetectivePanelState> }) {
  const { state: s, viewing, lastAnswer } = useStore(bridge.panel);
  const c = bridge.content.case;
  const send = (type: string, payload?: unknown) => bridge.channel.emit(type, payload);

  if (s.phase === 'briefing') {
    return (
      <div className="notebook">
        <h3>Case file</h3>
        <div className="panel" style={{ padding: 14 }}>
          <div className="pixel-font" style={{ color: 'var(--yellow)', fontSize: 14, lineHeight: 1.5, marginBottom: 8 }}>{c.title.toUpperCase()}</div>
          {c.briefing.map((line) => (
            <p key={line} style={{ margin: '0 0 8px', fontWeight: 700 }}>{line}</p>
          ))}
        </div>
        <p className="hint">Talk to the suspects and examine the clues. Read carefully: the answers are in the text!</p>
        <button className="btn yellow big" onClick={() => send('start')} autoFocus>🔍 Start investigating</button>
      </div>
    );
  }

  const q = currentQuestion(c, s);
  const viewed = viewing ? findThing(c, viewing) : null;
  const evidence = visibleEvidence(c, s);

  return (
    <div className="notebook">
      {viewed && (
        <section className="panel viewer" aria-live="polite" aria-label="What you found">
          <PixelSprite sprite={viewed.kind === 'suspect' ? lookTexture(viewed.thing.look) : evidenceTexture(viewed.thing.sprite)} scale={5} alt={viewed.thing.name} />
          <div>
            <div className="who">{viewed.thing.name}</div>
            {viewed.kind === 'suspect' && <div className="role">{viewed.thing.role}</div>}
            <blockquote>{viewed.kind === 'suspect' ? `“${viewed.thing.statement}”` : viewed.thing.description}</blockquote>
          </div>
        </section>
      )}

      {lastAnswer ? (
        <section className={`panel question`} aria-live="polite">
          <div className={`feedback ${lastAnswer.correct ? 'correct' : 'wrong'}`} style={{ WebkitLineClamp: 'unset', display: 'block' }}>
            <span className="f-title">{lastAnswer.correct ? 'Correct!' : 'Not quite.'}</span>
            <span className="f-answer">{lastAnswer.answer}. </span>
            <span>{lastAnswer.feedback}</span>
          </div>
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn yellow small" onClick={() => send('dismiss')} autoFocus>Continue ▶</button>
          </div>
        </section>
      ) : s.phase === 'investigate' && q ? (
        questionReady(s, q) ? (
          <Question title={`Question ${c.questions.indexOf(q) + 1} of ${c.questions.length}`} prompt={q.prompt} choices={q.choices} onPick={(i) => send('answer', i)} />
        ) : (
          <section className="panel question">
            <div className="q">Keep investigating</div>
            <p className="hint" style={{ margin: 0 }}>
              To open the next question:{' '}
              {missingFor(s, q).map((id) => (findThing(c, id)?.kind === 'suspect' ? `talk to ${nameOf(c, id)}` : `examine the ${nameOf(c, id).toLowerCase()}`)).join(' · ')}
            </p>
          </section>
        )
      ) : s.phase === 'accuse' ? (
        <Question title="Your accusation" prompt={c.solution.question} choices={c.solution.choices} onPick={(i) => send('accuse', i)} />
      ) : s.phase === 'proof' ? (
        <Question title="Prove it" prompt={c.proof.question} choices={c.proof.choices} onPick={(i) => send('prove', i)} />
      ) : s.phase === 'closed' ? (
        <section className="panel question" aria-live="polite">
          <div className="pixel-font" style={{ color: isSolved(c, s) ? 'var(--good)' : 'var(--yellow)', fontSize: 14, lineHeight: 1.6 }}>
            {isSolved(c, s) ? 'CASE SOLVED!' : 'CASE CLOSED'}
          </div>
          <p style={{ fontWeight: 800 }}>{c.solution.choices[c.solution.answer]}</p>
          <p className="hint">{c.solution.explanation}</p>
          <p className="hint"><b>The proof:</b> {c.proof.choices[c.proof.answer]}. {c.proof.explanation}</p>
          <button className="btn yellow" onClick={() => send('close')} autoFocus>See my results ▶</button>
        </section>
      ) : null}

      <section aria-label="People">
        <h3>People</h3>
        <div className="nb-list">
          {c.suspects.map((p) => (
            <button key={p.id} className={`nb-item ${s.examined.includes(p.id) ? 'seen' : ''} ${viewing === p.id ? 'open' : ''}`} onClick={() => send('examine', p.id)} aria-label={`Talk to ${p.name}, ${p.role}`}>
              <PixelSprite sprite={lookTexture(p.look)} scale={2} />
              {p.name}
              {s.examined.includes(p.id) && <span aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      </section>
      <section aria-label="Clues">
        <h3>Clues</h3>
        <div className="nb-list">
          {evidence.map((e) => (
            <button key={e.id} className={`nb-item ${s.examined.includes(e.id) ? 'seen' : 'new'} ${viewing === e.id ? 'open' : ''}`} onClick={() => send('examine', e.id)} aria-label={`Examine ${e.name}`}>
              <PixelSprite sprite={evidenceTexture(e.sprite)} scale={3} />
              {e.name}
              {s.examined.includes(e.id) && <span aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function Question({ title, prompt, choices, onPick }: { title: string; prompt: string; choices: string[]; onPick: (i: number) => void }) {
  return (
    <section className="panel question" aria-label={title}>
      <div className="kicker" style={{ color: 'var(--cyan)', fontWeight: 900, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{title}</div>
      <div className="q">{prompt}</div>
      <div className="answers">
        {choices.map((ch, i) => (
          <button key={ch} className="btn ghost" onClick={() => onPick(i)} autoFocus={i === 0}>
            <kbd style={{ color: 'var(--yellow)', fontFamily: 'var(--font-body)' }}>{i + 1}</kbd> {ch}
          </button>
        ))}
      </div>
    </section>
  );
}
