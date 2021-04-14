import Component from '../../core/component.js';
import Polygon from '../shapes/polygon.js';
import Transform from '../transform.js';

/**
 * Represents the collider of a shape.
 *
 * @class PolygonCollider
 * @extends {Component}
 */
class PolygonCollider extends Component {
  /**
   * Creates an instance of PolygonCollider.
   *
   * @param {number} friction
   * @param {number} bounciness
   * @memberof PolygonCollider
   */
  constructor(friction, bounciness) {
    super();

    this.friction = friction;
    this.bounciness = bounciness;

    this.broadCollided = false;
    this.narrowCollided = false;
  }
}

PolygonCollider.ATTRIBUTES = {
  SINGLE: true,
  REQUIRES: [
    Transform,
    Polygon,
  ],
};

export default PolygonCollider;
