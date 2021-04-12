import Component from '../../core/component.js';
import Shape from '../shapes/package/shape.js';
import Transform from '../transform.js';

/**
 * Represents the collider of a shape.
 *
 * @class ShapeCollider
 * @extends {Component}
 */
class ShapeCollider extends Component {
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
  }
}

ShapeCollider.ATTRIBUTES = {
  SINGLE: true,
  REQUIRES: [
    Transform,
    Shape,
  ],
};

export default ShapeCollider;
