import Vector2D from 'math/vector2d';

enum ITouchPhase {
  Began,
  Moved,
  Ended
}

interface ITouch {
  identifier: number;
  phase: ITouchPhase;
  position: Vector2D;
  pressure: number;
  radius: Vector2D;
  rotation: number;
}

class Input {
  readonly touches: ITouch[] = [];

  getKey() {

  }

  getKeyDown() {

  }

  getKeyUp() {

  }

  getMouseButton() {

  }

  getMouseButtonDown() {
    
  }

  getMouseButtonUp() {
    
  }
}

export default new Input();
