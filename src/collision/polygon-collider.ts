import Component from 'core/component';
import { LayerCollision } from './layer-collision-matrix';

/**
 * Represents the collider of a shape.
 *
 * @class PolygonCollider
 * @extends {Component}
 */
class PolygonCollider extends Component {
  friction: number;
  bounciness: number;
  readonly collisionLayer: LayerCollision | string;

  /**
   * Creates an instance of PolygonCollider.
   *
   * @param {number} friction
   * @param {number} bounciness
   * @memberof PolygonCollider
   */
  constructor(friction: number, bounciness: number, collisionLayer: LayerCollision | string) {
    super();

    this.friction = friction;
    this.bounciness = bounciness;
    this.collisionLayer = collisionLayer;
  }

  getAttributes() {
    return {
      allowMultiple: true,
    }
  }
}

export default PolygonCollider;
