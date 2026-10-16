/** Keyboard, mouse and touch all feed the same control state. Games read it every frame. */
export type Control = 'left' | 'right' | 'up' | 'down' | 'action' | 'alt';

const KEYMAP: Record<string, Control> = {
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  ArrowUp: 'up',
  KeyW: 'up',
  ArrowDown: 'down',
  KeyS: 'down',
  Space: 'action',
  KeyX: 'alt',
  KeyZ: 'alt',
};

type KeyListener = (code: string, e: KeyboardEvent) => void;

export class InputState {
  private down = new Set<Control>();
  private pressed = new Set<Control>();
  private keyListeners = new Set<KeyListener>();
  /** Set by touch controls so scenes can show touch hints. */
  touchUsed = false;

  press(c: Control) {
    if (!this.down.has(c)) this.pressed.add(c);
    this.down.add(c);
  }

  release(c: Control) {
    this.down.delete(c);
  }

  isDown(c: Control) {
    return this.down.has(c);
  }

  /** True once per press (edge-triggered). */
  consume(c: Control) {
    const p = this.pressed.has(c);
    this.pressed.delete(c);
    return p;
  }

  clear() {
    this.down.clear();
    this.pressed.clear();
  }

  /** Raw key presses (digits, Enter, Backspace…) for game-specific shortcuts. */
  onKey(fn: KeyListener) {
    this.keyListeners.add(fn);
    return () => this.keyListeners.delete(fn);
  }

  /** Listens on window while a game runs. Returns a detach function. */
  attachKeyboard(target: Window = window, enabled: () => boolean = () => true) {
    const isTyping = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
    };
    const onDown = (e: KeyboardEvent) => {
      if (!enabled() || isTyping(e)) return;
      const c = KEYMAP[e.code];
      if (c) {
        // Space on a focused button should still click it (accessibility), not fire the ship.
        const onButton = (e.target as HTMLElement | null)?.tagName === 'BUTTON';
        if (c === 'action' && onButton) return;
        e.preventDefault();
        if (!e.repeat) this.press(c);
      }
      if (!e.repeat) this.keyListeners.forEach((fn) => fn(e.code, e));
    };
    const onUp = (e: KeyboardEvent) => {
      const c = KEYMAP[e.code];
      if (c) this.release(c);
    };
    const onBlur = () => this.clear();
    target.addEventListener('keydown', onDown);
    target.addEventListener('keyup', onUp);
    target.addEventListener('blur', onBlur);
    return () => {
      target.removeEventListener('keydown', onDown);
      target.removeEventListener('keyup', onUp);
      target.removeEventListener('blur', onBlur);
      this.clear();
    };
  }
}

/** "Digit1"/"Numpad1" -> 0, … ; null for other keys. */
export function digitIndex(code: string): number | null {
  const m = /^(?:Digit|Numpad)([1-9])$/.exec(code);
  return m ? Number(m[1]) - 1 : null;
}
