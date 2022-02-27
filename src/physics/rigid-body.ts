import Component from 'core/component';
import Transform from 'common/transform';
import Vector2D from 'math/vector2d';
import PolygonCollider from 'collision/polygon-collider';

/**
 * Represents a simple (clockwise) polygon.
 *
 * @class Polygon
 */
class RigidBody extends Component {
  public angularDrag: number = 0;
  public angularVelocity: number = 0;
  public drag: number = 0;
  public velocity: Vector2D = new Vector2D(0, 0);

  public isKinematic: boolean = false;

  public isSleeping: boolean = true;
  public sleepThreshold: number = 0.05;

  addForceAtLocalPosition(force: Vector2D, position: Vector2D) {
    this.isSleeping = false;

    // TODO: Calculate torque and friction.
    this.velocity.add(force);
  }

  getAttributes() {
    return {
      allowMultiple: false,
      requiredComponents: [Transform, PolygonCollider],
    };
  }
}

export default RigidBody;