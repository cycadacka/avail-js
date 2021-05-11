import Component from 'core/component';
import Transform from 'common/transform';
import Vector2D from 'math/vector2d';

/**
 * Defines the behavior of a RigidBody.
 * 
 * @enum {number}
 */
export enum BodyType {
  /**
   * Dynamic rigid-bodies will **move under simulation** (default).
   */
  Dynamic,
  /**
   * Kinematic rigid-bodies will move under simulation, but under explicit
   * **user-control**. Note that kinematic rigid-bodies still moves with
   * velocity but is unaffected by other outside forces or gravity.
   */
  Kinematic,
  /**
   * Static rigid-bodies will **not move** under simulation. Note that collision
   * between two static rigid-bodies is not supported.
   */
  Static,
}

/**
 * Defines how collisions are detected.
 *
 * @enum {number}
 */
export enum CollisionDetectionMode {
  /**
   * Collision contacts are only generated at the new position. Note that
   * entities may overlap or pass through each other during a physics update,
   * if they are moving fast enough (default).
   */
  Discrete,
  /**
   * Calculates the first impact point of any of the `Collider2D`s, and moves
   * the `Transform` there. Note that this takes more CPU time than Discrete.
   */
  Continuous,
}

/**
 * Defines how the rigid-bodies "sleeps" to save processor time when it is at rest
 * (not moving).
 *
 * @enum {number}
 */
export enum SleepMode {
  /**
   * RigidBody is initially asleep but can be awoken by other collisions.
   */
  Sleep,
  /**
   * RigidBody is initially awake (default).
   */
  Awake,
  /**
   * RigidBody never sleeps.
   */
  Insomniac,
}

interface RigidBodyConfig {
  bodyType: BodyType,
  mass: number,
  drag: number,
  angularDrag: number,
  gravityScale: number,
  collisionDetectionMode: CollisionDetectionMode,
  sleepMode: SleepMode,
  constrainX: boolean,
  constrainY: boolean,
  constrainZ: boolean,
}

/**
 * Represents the a polygon that can be affected by Physics
 *
 * @class RigidBody
 * @extends {CollisionListener}
 */
class RigidBody extends Component {
  // #region RigidBodyConfig
  bodyType: BodyType;
  mass: number;
  drag: number;
  angularDrag: number;
  gravityScale: number;
  collisionDetection: CollisionDetectionMode;
  sleepMode: SleepMode;
  constrainX: boolean;
  constrainY: boolean;
  constrainZ: boolean;
  // #endregion cspell:disable-line
  velocity: Vector2D = Vector2D.zero;
  angularVelocity: number = 0;
  /** Relative to local-space. */
  centerOfMass: Vector2D = Vector2D.zero;

  /**
   * Creates an instance of RigidBody.
   *
   * @memberof RigidBody
   */
  constructor({
    bodyType=BodyType.Dynamic,
    mass=1,
    drag=0,
    angularDrag=0.05,
    gravityScale=1,
    collisionDetectionMode: collisionDetection=CollisionDetectionMode.Discrete,
    sleepMode=SleepMode.Awake,
    constrainX=false,
    constrainY=false,
    constrainZ=false,
  }: RigidBodyConfig) {
    super();

    this.bodyType = bodyType;
    this.mass = mass;
    this.drag = drag;
    this.angularDrag = angularDrag;
    this.gravityScale = gravityScale;
    this.collisionDetection = collisionDetection;
    this.sleepMode = sleepMode;
    this.constrainX = constrainX;
    this.constrainY = constrainY;
    this.constrainZ = constrainZ;
  }

  addForce(force: Vector2D) {
    this.velocity.add(force.clone().divide(this.mass));
  }

  addTorque(force: number) {
    this.angularVelocity += force / this.mass;
  }

  getAttributes() {
    return {
      allowMultiple: false,
    };
  }
}

export default RigidBody;
