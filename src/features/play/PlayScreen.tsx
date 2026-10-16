import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import type Phaser from 'phaser';
import { useApp } from '../../app/AppContext';
import { navigate } from '../../app/router';
import { ContentError } from '../../education/questionEngine';
import { audio } from '../../games/shared/audio';
import { createGame } from '../../games/shared/createGame';
import { InputState } from '../../games/shared/input';
import { Channel, Store } from '../../games/shared/store';
import { initialHud, type GameBridge, type GameDefinition, type HudState, type ResultMeta } from '../../games/shared/types';
import type { ActiveSession, CompletionOutcome } from '../../services/progress/progressService';
import { ScoreKeeper } from '../../services/progress/scoring';
import type { GameResult } from '../../services/progress/types';
import { HudStats, PromptPanel } from './Hud';
import { ErrorCard, PauseOverlay, StartScreen } from './Overlays';
import { ResultsScreen } from './ResultsScreen';
import { isTouchDevice, TouchControls } from './TouchControls';

type Phase = 'intro' | 'loading' | 'playing' | 'paused' | 'results' | 'error';

interface Run {
  game: Phaser.Game | null;
  bridge: GameBridge<unknown, unknown>;
  session: ActiveSession;
  detachKeys: () => void;
  done: boolean;
  Panel: ComponentType<{ bridge: GameBridge<unknown, unknown> }> | null;
}

interface Outcome {
  result: GameResult;
  completion: CompletionOutcome | null;
  saveError?: string;
}

export function PlayScreen({ def, onSettings }: { def: GameDefinition<unknown, unknown>; onSettings: () => void }) {
  const app = useApp();
  const level = app.level!;
  const stageRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<Run | null>(null);
  const phaseRef = useRef<Phase>('intro');
  const [phase, setPhaseState] = useState<Phase>('intro');
  const [run, setRun] = useState<Run | null>(null);
  const [error, setError] = useState('');
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const touch = isTouchDevice();

  const setPhase = (p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  };

  const destroyRun = useCallback(() => {
    const r = runRef.current;
    if (!r) return;
    runRef.current = null;
    r.detachKeys();
    r.bridge.channel.clear();
    r.game?.destroy(true);
    r.game = null;
  }, []);

  useEffect(() => () => {
    destroyRun();
    audio.stopMusic();
  }, [destroyRun]);

  const finish = useCallback(
    async (r: Run, status: 'completed' | 'quit', meta?: ResultMeta) => {
      if (r.done) return;
      r.done = true;
      const k = r.bridge.keeper;
      const result: GameResult = {
        gameId: def.id,
        level: level.cefr,
        status,
        score: k.score,
        correct: k.correct,
        incorrect: k.incorrect,
        bestCombo: k.bestCombo,
        challenges: r.bridge.hud.get().progressDone,
        answers: [...k.answers],
        meta,
      };
      if (status === 'completed') {
        audio.stopMusic();
        setOutcome({ result, completion: null });
        setPhase('results');
        // Let the scene finish its frame before the canvas goes away.
        setTimeout(() => {
          if (runRef.current === r) destroyRun();
        }, 60);
      }
      try {
        const completion = await app.progress.completeSession(r.session, result);
        if (status === 'completed') setOutcome({ result, completion });
      } catch (e) {
        if (status === 'completed') setOutcome({ result, completion: null, saveError: e instanceof Error ? e.message : String(e) });
      }
    },
    [app.progress, def.id, destroyRun, level.cefr],
  );

  const start = useCallback(async () => {
    audio.unlock();
    audio.sfx('select');
    destroyRun();
    setOutcome(null);
    setError('');
    let content;
    try {
      content = def.buildSession(level.cefr, { recent: app.progress.recentContent(def.id), rng: Math.random });
    } catch (e) {
      setError(e instanceof ContentError ? e.message : 'Something went wrong while loading the missions.');
      setPhase('error');
      return;
    }
    const session = app.progress.startSession(def.id, level.cefr, content.contentIds);
    const r: Run = {
      game: null,
      session,
      detachKeys: () => {},
      done: false,
      Panel: null,
      bridge: {
        gameId: def.id,
        level: level.cefr,
        content: content.data,
        keeper: new ScoreKeeper(),
        hud: new Store<HudState>(initialHud(content.total, `${def.progressLabel} 1/${content.total}`)),
        panel: new Store(def.initialPanel()),
        channel: new Channel(),
        input: new InputState(),
        audio,
        reducedMotion: app.reducedMotion,
        finish: (meta) => void finish(r, 'completed', meta),
      },
    };
    runRef.current = r;
    setRun(r);
    setPhase('loading');
    try {
      const stage = stageRef.current;
      if (!stage) throw new Error('stage missing');
      const [game, Panel] = await Promise.all([createGame(stage, def, r.bridge), def.loadPanel ? def.loadPanel() : Promise.resolve(null)]);
      if (runRef.current !== r) {
        game.destroy(true);
        return;
      }
      r.game = game;
      r.Panel = Panel as Run['Panel'];
      // Development-only handle for browser testing; not included in production builds.
      if (import.meta.env.DEV) (window as unknown as { __gz: unknown }).__gz = { game, bridge: r.bridge };
      r.detachKeys = r.bridge.input.attachKeyboard(window, () => phaseRef.current === 'playing');
      setRun({ ...r });
      setPhase('playing');
      audio.music(def.music);
    } catch (e) {
      console.error(e);
      setError('The game could not start. Please reload the page and try again.');
      setPhase('error');
    }
  }, [app.progress, app.reducedMotion, def, destroyRun, finish, level.cefr]);

  const pause = useCallback(() => {
    const r = runRef.current;
    if (!r?.game || phaseRef.current !== 'playing') return;
    r.game.scene.pause('main');
    r.bridge.input.clear();
    audio.pauseMusic();
    audio.sfx('pause');
    setPhase('paused');
  }, []);

  const resume = useCallback(() => {
    const r = runRef.current;
    if (!r?.game || phaseRef.current !== 'paused') return;
    r.game.scene.resume('main');
    audio.resumeMusic();
    setPhase('playing');
  }, []);

  const quit = useCallback(async () => {
    const r = runRef.current;
    if (r && !r.done && r.bridge.keeper.answers.length > 0) await finish(r, 'quit');
    destroyRun();
    audio.stopMusic();
    navigate('#/');
  }, [destroyRun, finish]);

  // Esc / P pauses; leaving the tab pauses.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Escape' && e.code !== 'KeyP') return;
      if (document.querySelector('[role="dialog"][aria-label="Settings"]')) return;
      if (phaseRef.current === 'playing') pause();
      else if (phaseRef.current === 'paused' && e.code === 'KeyP') resume();
    };
    const onHide = () => {
      if (document.hidden) pause();
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [pause, resume]);

  const showHud = run && (phase === 'loading' || phase === 'playing' || phase === 'paused');
  const Panel = run?.Panel;

  return (
    <div className="play-screen" style={{ '--accent': def.accent } as React.CSSProperties}>
      <header className="hud">
        <button
          className="btn ghost icon small"
          aria-label={phase === 'playing' ? 'Pause' : 'Back to arcade'}
          onClick={() => (phase === 'playing' ? pause() : phase === 'paused' ? resume() : void quit())}
        >
          {phase === 'playing' ? '❚❚' : '←'}
        </button>
        <span className="title">{def.title.toUpperCase()}</span>
        <span className="spacer" />
        {showHud && <HudStats hud={run.bridge.hud} />}
        <button
          className="btn ghost icon small"
          aria-label={app.settings.muted ? 'Turn sound on' : 'Turn sound off'}
          aria-pressed={!app.settings.muted}
          onClick={() => app.updateSettings({ muted: !app.settings.muted })}
        >
          {app.settings.muted ? '🔇' : '🔊'}
        </button>
      </header>

      {showHud && <PromptPanel hud={run.bridge.hud} />}

      <div className={`stage-wrap ${def.layout === 'side' ? 'side' : ''}`}>
        <div className="stage" ref={stageRef} />
        {showHud && Panel && def.layout === 'side' && (
          <aside className="side-panel" aria-label="Case notebook">
            <Panel bridge={run.bridge} />
          </aside>
        )}
        {showHud && Panel && def.layout === 'stage' && <Panel bridge={run.bridge} />}
        {phase === 'loading' && (
          <div className="loading" role="status">
            <div className="loading-card">
              <div className="logo" style={{ textAlign: 'center' }}>
                <span className="l1">TRONWELL <em>KIDS</em></span>
              </div>
              <div className="meter"><span /></div>
              <span>LOADING…</span>
            </div>
          </div>
        )}
      </div>

      {touch && showHud && <TouchControls layout={def.touch} input={run.bridge.input} />}

      {phase === 'intro' && <StartScreen def={def} cefr={level.cefr} portalId={level.portalId} onStart={() => void start()} onBack={() => navigate('#/')} />}
      {phase === 'paused' && (
        <PauseOverlay onResume={resume} onRestart={() => void start()} onQuit={() => void quit()} onSettings={onSettings} hasAnswers={!!run?.bridge.keeper.answers.length} />
      )}
      {phase === 'results' && outcome && (
        <ResultsScreen def={def} result={outcome.result} completion={outcome.completion} saveError={outcome.saveError} onAgain={() => void start()} onBack={() => navigate('#/')} />
      )}
      {phase === 'error' && <ErrorCard message={error} onRetry={() => void start()} onBack={() => navigate('#/')} />}
    </div>
  );
}
