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
    
    if (inputSystem.keys.down.has(ev.code) || inputSystem.keys.press.has(ev.code)) {
      continue;
    }

    inputSystem.keys.down.add(ev.code);
    inputSystem.keys.up.delete(ev.code);
  }
});

document.addEventListener('keyup', (ev) => {
  for (let i = 0; i < inputSystems.length; i++) {
    const inputSystem = inputSystems[i];

    inputSystem.keys.press.delete(ev.code);
    inputSystem.keys.down.delete(ev.code);
    inputSystem.keys.up.add(ev.code);
  }
});

export interface InputInterface {
  get touches(): IterableIterator<TouchInfo>;
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
  keys = {
    down: new Set<string>(),
    press: new Set<string>(),
    up: new Set<string>(),
  };
  mouseButtons = {
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
    return this.keys.press.has(code);
  }

  getKeyDown(code: string): boolean {
    return this.keys.down.has(code);
  }

  getKeyUp(code: string): boolean {
    return this.keys.up.has(code);
  }

  getAnyKeyPress(): boolean {
    return this.keys.press.size > 0;
  }

  getAnyKeyDown(): boolean {
    return this.keys.down.size > 0;
  }

  getAnyKeyUp(): boolean {
    return this.keys.up.size > 0;
  }

  getMouseButtonPress(button: number): boolean {
    return this.mouseButtons.press.has(button);
  }

  getMouseButtonDown(button: number): boolean {
    return this.mouseButtons.down.has(button);
  }

  getMouseButtonUp(button: number): boolean {
    return this.mouseButtons.up.has(button);
  }

  getAnyMouseButtonPress(): boolean {
    return this.mouseButtons.press.size > 0;
  }

  getAnyMouseButtonDown(): boolean {
    return this.mouseButtons.down.size > 0;
  }

  getAnyMouseButtonUp(): boolean {
    return this.mouseButtons.up.size > 0;
  }

  update() {
    for (const keyDown of this.keys.down) {
      this.keys.press.add(keyDown);
      this.keys.down.delete(keyDown);
    }

    this.keys.up.clear();

    for (const mouseButtonDown of this.mouseButtons.down) {
      this.mouseButtons.press.add(mouseButtonDown);
      this.mouseButtons.down.delete(mouseButtonDown);
    }

    this.mouseButtons.up.clear();
  }
};

export default Input;
