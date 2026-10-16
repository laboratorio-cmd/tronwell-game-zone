import { useState } from 'react';
import type { Control, InputState } from '../../games/shared/input';
import type { GameDefinition } from '../../games/shared/types';

function Pad({ input, control, label, className = '', aria }: { input: InputState; control: Control; label: string; className?: string; aria: string }) {
  const [on, setOn] = useState(false);
  const press = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    input.touchUsed = true;
    input.press(control);
    setOn(true);
  };
  const release = () => {
    input.release(control);
    setOn(false);
  };
  return (
    <button
      type="button"
      className={`tbtn ${className} ${on ? 'on' : ''}`}
      aria-label={aria}
      onPointerDown={press}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
      onContextMenu={(e) => e.preventDefault()}
    >
      {label}
    </button>
  );
}

/** On-screen buttons for phones and tablets. They feed the same InputState as the keyboard. */
export function TouchControls({ layout, input }: { layout: GameDefinition['touch']; input: InputState }) {
  if (layout === 'none') return null;
  const action = layout === 'shooter' ? 'FIRE' : layout === 'platformer' ? 'JUMP' : null;
  return (
    <div className="touchpad">
      <div className="grp">
        {layout === 'racer' ? (
          <>
            <Pad input={input} control="up" label="▲" aria="Lane up" />
            <Pad input={input} control="down" label="▼" aria="Lane down" />
          </>
        ) : (
          <>
            <Pad input={input} control="left" label="◀" aria="Left" />
            <Pad input={input} control="right" label="▶" aria="Right" />
          </>
        )}
      </div>
      {action && (
        <div className="grp">
          <Pad input={input} control="action" label={action} className="act" aria={action === 'FIRE' ? 'Fire' : 'Jump'} />
        </div>
      )}
    </div>
  );
}

export function isTouchDevice() {
  return typeof window !== 'undefined' && (window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window);
}
