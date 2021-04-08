import Vector2 from '../math/vector2d.js';
import Matrix3x3 from '../math/matrix3x3.js';
import Component from '../core/component.js';

/**
 * Position, rotation and scale of an entity.
 *
 * @class Transform
 * @extends {Component}
 */
class Transform extends Component {
  /**
   * @param {Vector2} [localPosition]
   * @param {number} [localRotation]
   * @param {Vector2} [localScale]
   */
  constructor(
    localPosition=Vector2.zero,
    localRotation=0,
    localScale=Vector2.one,
  ) {
    super();

    this.localPosition = localPosition;
    this.localRotation = localRotation;
    this.localScale = localScale;
  }

  /**
   * Position of an entity.
   *
   * @type {Vector2}
   * @memberOf Transform
   */
  get position() {
    /** @type {Transform} */
    const parent = this._parent;
    return new Proxy(this.localPosition, {
      get(target, p) {
        return parent?.localToWorldMatrix.multiplyVector2(target)[p] ||
        target.clone()[p];
      },
      set(target, p, value) {
        switch (p) {
        case 'x':
          target.x = parent?.localToWorldMatrix
            .multiplyVector2({x: value, y: 0}).x || value;
          break;
        case 'y':
          target.y = parent?.localToWorldMatrix
            .multiplyVector2({x: 0, y: value}).y || value;
          break;
        default:
          target[p] = value;
          break;
        }

        return true;
      },
    });
  }

  /**
   * Position of an entity.
   *
   * @type {Vector2}
   * @memberOf Transform
   */
  set position(value) {
    const local = this.worldToLocalMatrix.multiplyVector2(value);

    this.localPosition.x = local.x;
    this.localPosition.y = local.y;
  }

  /**
   * Rotation of an entity.
   *
   * @type {number}
   * @memberOf Transform
   */
  get rotation() {
    return this.localRotation + (this._parent?.rotation || 0);
  }

  /**
   * Rotation of an entity.
   *
   * @type {number}
   * @memberOf Transform
   */
  set rotation(value) {
    this.localRotation = value - (this._parent?.rotation || 0);
  }

  /**
   * Scale of an entity.
   *
   * @type {Vector2}
   * @memberOf Transform
   */
  get scale() {
    const self = this;

    return new Proxy(this.localScale, {
      get(target, p) {
        return Vector2.scale((self._parent?.scale || Vector2.one), target)[p];
      },
      set(target, p, value) {
        switch (p) {
        case 'x':
          target.x = value / (self._parent?.scale.x || 1);
          break;
        case 'y':
          target.y = value / (self._parent?.scale.y || 1);
          break;
        default:
          target[p] = value;
          break;
        }

        return true;
      },
    });
  }

  /**
   * Scale of an entity.
   *
   * @type {Vector2}
   * @memberOf Transform
   */
  set scale(value) {
    const offset = this._parent?.scale || Vector2.one;

    this.localScale.x = value.x / offset.x;
    this.localScale.y = value.y / offset.y;
  }

  /**
   * Matrix that transforms a point from local space into world space.
   *
   * @readonly
   * @type {Matrix3x3}
   * @memberof Transform
   */
  get localToWorldMatrix() {
    return Matrix3x3.createTRS(this.position, this.rotation, this.scale);
  }

  /**
   * Matrix that transforms a point from world space into local space.
   *
   * @readonly
   * @type {Matrix3x3}
   * @memberOf Transform
   */
  get worldToLocalMatrix() {
    return this.localToWorldMatrix.inverse;
  }
}

Transform.ATTRIBUTES = Object.freeze({
  SINGLE: true,
});

export default Transform;
