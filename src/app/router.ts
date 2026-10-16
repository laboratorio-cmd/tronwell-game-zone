import { useEffect, useState } from 'react';

export type Route = { name: 'lobby' } | { name: 'play'; gameId: string } | { name: 'progress' };

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts[0] === 'play' && parts[1]) return { name: 'play', gameId: parts[1] };
  if (parts[0] === 'progress') return { name: 'progress' };
  return { name: 'lobby' };
}

/** Hash routing keeps the app working as static files on GitHub Pages. */
export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const on = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export function navigate(to: '#/' | '#/progress' | `#/play/${string}`) {
  if (window.location.hash !== to) window.location.hash = to;
}
