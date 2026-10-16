import { ASSETS } from '../games/shared/pixel/assets';
import { spriteDataUrl } from '../games/shared/pixel/render';

interface Props {
  /** Texture key from the asset manifest, e.g. "ship" or "icon-cat". */
  sprite: string;
  frame?: number;
  scale?: number;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
}

/** Shows a game sprite in the React UI (same art as in the games). */
export function PixelSprite({ sprite, frame = 0, scale = 4, className = '', alt = '', style }: Props) {
  const a = ASSETS[sprite];
  let src = '';
  if (a?.kind === 'pixel') src = spriteDataUrl(sprite, a.def, scale, frame);
  else if (a?.kind === 'image') src = a.url;
  else if (a?.kind === 'canvas') src = a.draw().toDataURL();
  if (!src) return null;
  return <img className={`pixel-img ${className}`} src={src} alt={alt} aria-hidden={alt ? undefined : true} style={style} draggable={false} />;
}
