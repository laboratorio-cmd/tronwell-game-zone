import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@fontsource/nunito/900.css';
import '@fontsource/press-start-2p/400.css';
import './styles/app.css';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
