import System from 'core/types';
import Vector2D from 'math/vector2d';
import { ArrayProxy } from './types';

enum TouchPhase {
  Began = 1,
  Moved,
  Ended,
  Cancelled
}

interface TouchInfo {
  identifier: number;
  phase: TouchPhase;
  position: Vector2D;
  pressure: number;
  radius: Vector2D;
  rotation: number;
}

const inputSystems: Input[] = [];

document.addEventListener('touchstart', (ev) => {
  ev.preventDefault();
  
  for (let k = 0; k < ev.touches.length; k++) {
    const touch: Touch = ev.touches[k];

    for (let j = 0; j < inputSystems.length; j++) {
      const inputSystem = inputSystems[j];

      inputSystem._touches.set(touch.identifier, {
        identifier: touch.identifier,
        phase: TouchPhase.Began,
        position: new Vector2D(touch.clientX, touch.clientY),
        pressure: touch.force,
        radius: new Vector2D(touch.radiusX, touch.radiusY),
        rotation: touch.rotationAngle,
      });
    }
  }
});

document.addEventListener('touchmove', createTouchListener(TouchPhase.Moved));
document.addEventListener('touchend', createTouchListener(TouchPhase.Ended));
document.addEventListener('touchcancel', createTouchListener(TouchPhase.Cancelled));

function createTouchListener(phase: TouchPhase) {
  return function touchListener(ev: TouchEvent) {
    ev.preventDefault();
    
    for (let k = 0; k < ev.touches.length; k++) {
      const touch = ev.touches[k];

      for (let j = 0; j < inputSystems.length; j++) {
        const inputSystem = inputSystems[j];

        if (inputSystem._touches.has(touch.identifier)) {
          const touchInfo: TouchInfo = inputSystem._touches.get(touch.identifier)!;
          
          touchInfo.phase = phase;
          touchInfo.position.x = touch.clientX;
          touchInfo.position.y = touch.clientY;
          touchInfo.pressure = touch.force;
          touchInfo.radius.x = touch.radiusX;
          touchInfo.radius.y = touch.radiusY;
          touchInfo.rotation = touch.rotationAngle;
        }
      }
    }
  }
}


document.addEventListener('keydown', (ev) => {
  for (let i = 0; i < inputSystems.length; i++) {
    const inputSystem = inputSystems[i];
    
    if (inputSystem._keys.down.has(ev.code) || inputSystem._keys.press.has(ev.code)) {
      continue;
    }

    inputSystem._keys.down.add(ev.code);
    inputSystem._keys.up.delete(ev.code);
  }
});

document.addEventListener('keyup', (ev) => {
  for (let i = 0; i < inputSystems.length; i++) {
    const inputSystem = inputSystems[i];

    inputSystem._keys.press.delete(ev.code);
    inputSystem._keys.down.delete(ev.code);
    inputSystem._keys.up.add(ev.code);
  }
});

export interface InputInterface {
  touches: IterableIterator<TouchInfo>;
  getKeyPress(code: string): boolean;
  getKeyDown(code: string): boolean;
  getKeyUp(code: string): boolean;
  getAnyKeyPress(): boolean;
  getAnyKeyDown(): boolean;
  getAnyKeyUp(): boolean;
  getMouseButtonPress(button: number): boolean;
  getMouseButtonDown(button: number): boolean;
  getMouseButtonUp(button: number): boolean;
  getAnyMouseButtonPress(): boolean;
  getAnyMouseButtonDown(): boolean;
  getAnyMouseButtonUp(): boolean;
}

class Input implements InputInterface, System {
  _touches: Map<number, TouchInfo> = new Map();
  _keys = {
    down: new Set<string>(),
    press: new Set<string>(),
    up: new Set<string>(),
  };
  _mouseButtons = {
    down: new Set<number>(),
    press: new Set<number>(),
    up: new Set<number>(),
  };

  constructor() {
    inputSystems.push(this);
  }

  get touches(): IterableIterator<TouchInfo> {
    return this._touches.values();
  }

  getKeyPress(code: string): boolean {
    return this._keys.press.has(code);
  }

  getKeyDown(code: string): boolean {
    return this._keys.down.has(code);
  }

  getKeyUp(code: string): boolean {
    return this._keys.up.has(code);
  }

  getAnyKeyPress(): boolean {
    return this._keys.press.size > 0;
  }

  getAnyKeyDown(): boolean {
    return this._keys.down.size > 0;
  }

  getAnyKeyUp(): boolean {
    return this._keys.up.size > 0;
  }

  getMouseButtonPress(button: number): boolean {
    return this._mouseButtons.press.has(button);
  }

  getMouseButtonDown(button: number): boolean {
    return this._mouseButtons.down.has(button);
  }

  getMouseButtonUp(button: number): boolean {
    return this._mouseButtons.up.has(button);
  }

  getAnyMouseButtonPress(): boolean {
    return this._mouseButtons.press.size > 0;
  }

  getAnyMouseButtonDown(): boolean {
    return this._mouseButtons.down.size > 0;
  }

  getAnyMouseButtonUp(): boolean {
    return this._mouseButtons.up.size > 0;
  }

  update() {
    for (const keyDown of this._keys.down) {
      this._keys.press.add(keyDown);
      this._keys.down.delete(keyDown);
    }

    this._keys.up.clear();

    for (const mouseButtonDown of this._mouseButtons.down) {
      this._mouseButtons.press.add(mouseButtonDown);
      this._mouseButtons.down.delete(mouseButtonDown);
    }

    this._mouseButtons.up.clear();
  }
};

export default Input;
