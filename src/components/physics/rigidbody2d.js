import Component from '../../core/component.js';

/**
 * @exports
 * @type {Readonly<{DYNAMIC: Symbol, KINEMATIC: Symbol, STATIC: Symbol}>}
 */
export const BODY_TYPE = {
  DYNAMIC: Symbol('DYNAMIC'),
  KINEMATIC: Symbol('KINEMATIC'),
  STATIC: Symbol('STATIC'),
};

/**
 * @exports
 * @type {Readonly<{DISCRETE: Symbol, CONTINUOUS: Symbol}>}
 */
export const COLLISION_DETECTION = {
  DISCRETE: Symbol('DISCRETE'),
  CONTINUOUS: Symbol('CONTINUOUS'),
};

/**
 * @exports
 * @type {Readonly<{SLEEP: Symbol, AWAKE: Symbol, INSOMANIAC: Symbol}>}
 */
export const SLEEP_MODE = Object.freeze({
  SLEEP: Symbol('SLEEP'),
  AWAKE: Symbol('AWAKE'),
  INSOMANIAC: Symbol('INSOMANIAC'),
});

/**
 * Represents the a polygon that can be affected by Physics
 *
 * @class Rigidbody2D
 * @extends {Component}
 */
class Rigidbody2D extends Component {
  /**
   * Creates an instance of Rigidbody2D.
   *
   * @param {object} param
   * @param {Symbol} [param.bodyType]
   * @param {number} [param.mass]
   * @param {number} [param.linearDrag]
   * @param {number} [param.angularDrag]
   * @param {number} [param.gravityScale]
   * @param {Symbol} [param.collisionDetection]
   * @param {Symbol} [param.sleepMode]
   * @param {boolean} [param.constrainX]
   * @param {boolean} [param.constrainY]
   * @param {boolean} [param.constrainZ]
   * @memberof Rigidbody2D
   */
  constructor({
    bodyType=BODY_TYPE.DYNAMIC,
    mass=1,
    linearDrag=0,
    angularDrag=0.05,
    gravityScale=1,
    collisionDetection=COLLISION_DETECTION.DISCRETE,
    sleepMode=SLEEP_MODE.AWAKE,
    constrainX=false,
    constrainY=false,
    constrainZ=false,
  } = {}) {
    super();

    this.bodyType = bodyType;
    this.mass = mass;
    this.linearDrag = linearDrag;
    this.angularDrag = angularDrag;
    this.gravityScale = gravityScale;
    this.collisionDetection = collisionDetection;
    this.sleepMode = sleepMode;
    this.constrainX = constrainX;
    this.constrainY = constrainY;
    this.constrainZ = constrainZ;
  }
}

export default Rigidbody2D;
