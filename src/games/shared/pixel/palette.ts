/** Design tokens (see src/styles/tokens.css) plus a few extra pixel-art shades. */
export const COLORS = {
  navy: '#10172F',
  darkBlue: '#182449',
  arcadeBlue: '#2878FF',
  cyan: '#39D9FF',
  violet: '#7957FF',
  purple: '#B36BFF',
  orange: '#FF9F43',
  yellow: '#FFD166',
  text: '#F5F7FF',
  textSoft: '#B7C1DF',
  good: '#3DDC84',
  bad: '#FF5468',
} as const;

/** One character per colour in the ASCII sprites. '.' is transparent. */
export const PALETTE: Record<string, string> = {
  K: '#0B1024', // outline
  N: '#10172F',
  D: '#182449',
  d: '#24315E',
  B: '#2878FF',
  b: '#1B4FB0',
  C: '#39D9FF',
  L: '#A8F0FF',
  V: '#7957FF',
  v: '#4E36B8',
  P: '#B36BFF',
  O: '#FF9F43',
  o: '#C46A1C',
  Y: '#FFD166',
  y: '#D9A53A',
  Z: '#FFF1C4',
  W: '#F5F7FF',
  S: '#B7C1DF',
  G: '#6B7699',
  g: '#3A4466',
  R: '#FF5468',
  r: '#B8324A',
  E: '#3DDC84',
  e: '#1F9E5A',
  T: '#F2C29B',
  t: '#C68A5E',
  u: '#8A5A3B',
  H: '#6B4425',
  h: '#2A1E1A',
  M: '#8B5A2B',
  m: '#C08A4E',
  X: '#FF8FB8',
};

export function hexToInt(hex: string): number {
  return parseInt(hex.replace('#', ''), 16);
}
