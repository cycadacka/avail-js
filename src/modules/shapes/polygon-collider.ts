import Component from 'core/component';
import Polygon from './polygon';
import Transform from 'modules/transform';

/**
 * Represents the collider of a shape.
 *
 * @class PolygonCollider
 * @extends {Component}
 */
class PolygonCollider extends Component {
  public friction: number;
  public bounciness: number;

  /**
   * Creates an instance of PolygonCollider.
   *
   * @param {number} friction
   * @param {number} bounciness
   * @memberof PolygonCollider
   */
  constructor(friction: number, bounciness: number) {
    super();

    this.friction = friction;
    this.bounciness = bounciness;
  }

  get attributes() {
    return {
      single: true,
      requires: [
        Transform,
        Polygon,
      ],
    }
  }
}

export default PolygonCollider;
