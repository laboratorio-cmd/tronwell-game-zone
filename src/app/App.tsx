import { useState } from 'react';
import { LevelGate } from '../features/level/LevelGate';
import { Lobby } from '../features/lobby/Lobby';
import { PlayScreen } from '../features/play/PlayScreen';
import { ProgressScreen } from '../features/progress/ProgressScreen';
import { SettingsDialog } from '../features/settings/SettingsDialog';
import { getGame } from '../games/registry';
import { assetUrl } from '../games/shared/pixel/assets';
import { AppProvider, useApp } from './AppContext';
import { navigate, useRoute } from './router';

function Routes() {
  const route = useRoute();
  const { level } = useApp();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const openSettings = () => setSettingsOpen(true);

  let page;
  if (!level) page = <LevelGate />;
  else if (route.name === 'play') {
    const def = getGame(route.gameId);
    if (def) page = <PlayScreen key={def.id} def={def} onSettings={openSettings} />;
    else {
      navigate('#/');
      page = null;
    }
  } else if (route.name === 'progress') page = <ProgressScreen onSettings={openSettings} />;
  else page = <Lobby onSettings={openSettings} />;

  return (
    <>
      <div
        className="space-bg"
        aria-hidden="true"
        // Absolute URL: a relative url() inside a CSS variable would resolve against the stylesheet's folder.
        style={route.name === 'play' ? undefined : ({ '--station-bg': `url(${new URL(assetUrl('bg-space-atmosphere-1') ?? '', document.baseURI).href})` } as React.CSSProperties)}
      />
      <div className="app">{page}</div>
      {settingsOpen && <SettingsDialog onClose={() => setSettingsOpen(false)} />}
    </>
  );
}

export function App() {
  return (
    <AppProvider>
      <Routes />
    </AppProvider>
  );
}
