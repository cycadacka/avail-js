import Component from '../core/component';
import Vector2D from 'math/vector2d';

export interface ContactPoint {
  point: Vector2D;
  normal: Vector2D;
}

export interface CollisionInfo {
  entity: string;
  otherEntity: string;
  readonly contacts: ContactPoint[];
}

type CollisionListenerCallback = (info: CollisionInfo) => void;

class CollisionListener extends Component {
  public get attributes() {
    return {
      single: false,
      requires: [],
    };
  }

  public readonly fire: CollisionListenerCallback;

  constructor(callback: CollisionListenerCallback) {
    super();

    this.fire = callback;
  }
}

export default CollisionListener
