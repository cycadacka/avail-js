import Component from '../../core/component.js';
import Shape from '../shapes/package/shape.js';
import Transform from '../transform.js';

/**
 * Represents the collider of a shape.
 *
 * @class ShapeCollision
 * @extends {Component}
 */
class ShapeCollision extends Component {
  /**
   * Creates an instance of ShapeCollision.
   *
   * @param {number} friction
   * @param {number} bounciness
   * @memberof ShapeCollision
   */
  constructor(friction, bounciness) {
    super();

    this.friction = friction;
    this.bounciness = bounciness;
  }
}

ShapeCollision.ATTRIBUTES = {
  SINGLE: true,
  REQUIRES: [
    Transform,
    Shape,
  ],
};

export default ShapeCollision;
