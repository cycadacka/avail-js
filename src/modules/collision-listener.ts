import { PolygonCollisionInfo } from './shapes/polygon-collision';
import Component from '../core/component';

type CollisionListenerCallback = (info: PolygonCollisionInfo) => void;

class CollisionListener extends Component {
  public get attributes() {
    return {
      single: false,
      requires: [],
    };
  }

  public readonly callback: CollisionListenerCallback;

  constructor(callback: CollisionListenerCallback) {
    super();
    this.callback = callback;
  }
}

export default CollisionListener
