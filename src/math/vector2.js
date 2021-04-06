import MATH_CONST from './const.js';
import clamp from './clamp.js';

/**
 * Representation of 2D vectors and points.
 *
 * Inspired by Unity [game engine] developed by Unity Technologies
 */
class Vector2 {
  /**
   * Creates an instance of Vector2.
   *
   * @param {number} x X component of the 2D vector.
   * @param {number} y Y component of the 2D vector.
   * @memberof Vector2
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Iterates over the X and Y components of this 2D vector.
   *
   * @memberof Vector2
   */
  * [Symbol.iterator]() {
    yield this.x;
    yield this.y;
  }

  /**
   * Makes this 2D vector negative.
   *
   * @memberof Vector2
   * @return {Vector2} The 2D vector itself.
   */
  negative() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  /**
   * Adds this 2D vector to another 2D vector.
   *
   * @param {Vector2} vector 2D vector to add to this 2D vector.
   * @return {Vector2} The 2D vector itself.
   * @memberof Vector2
   */
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  /**
   * Subtracts this 2D vector by another 2D vector.
   *
   * @param {Vector2} vector 2D vector to subtract to this 2D vector.
   * @return {Vector2} The 2D vector itself.
   * @memberof Vector2
   */
  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  /**
   * Divides this 2D vector by a number
   *
   * @param {number} n Any number to divide by.
   * @return {Vector2} The 2D vector itself.
   * @memberof Vector2
   */
  divide(n) {
    this.x /= n;
    this.y /= n;
    return this;
  }

  /**
   * Multiplies this 2D vector by a number
   *
   * @param {number} n Any number to multiply by.
   * @return {Vector2} The 2D vector itself.
   * @memberof Vector2
   */
  multiply(n) {
    this.x *= n;
    this.y *= n;
    return this;
  }

  /**
   * Compares this 2D vector to another 2D vector if they are the same.
   *
   * @param {Vector2} vector 2D vector to compare to this 2D vector.
   * @return {boolean} If this 2D vector and another 2D vector are the same.
   * @memberof Vector2
   */
  equals(vector) {
    return (
      this.clone()
          .subtract(vector)
          .sqrMagnitude() < Number.EPSILON
    );
  }

  /**
   * Compares this 2D vector to another 2D vector if they are not the same.
   *
   * @param {Vector2} vector 2D vector to compare to this 2D vector.
   * @return {boolean} If this 2D vector and another 2D vector are not the same.
   * @memberof Vector2
   */
  notEquals(vector) {
    return (
      this.clone()
          .subtract(vector)
          .sqrMagnitude() >= Number.EPSILON
    );
  }

  /**
   * Returns a string representation of this 2D vector.
   *
   * @param {number} [radix] Base to use for representing a numeric value
   * @return {string} String representation of a 2D vector.
   * @memberof Vector2
   */
  toString(radix = 10) {
    return `(${this.x.toString(radix)}, ${this.y.toString(radix)})`;
  }

  /**
   * Returns the length of the 2D vector.
   *
   * @return {number} The length of the 2D vector.
   * @memberof Vector2
   */
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Returns the squared length of the 2D vector.
   *
   * @return {number} The squared length of the 2D vector.
   * @memberof Vector2
   */
  sqrMagnitude() {
    return this.x * this.x + this.y + this.y;
  }

  /**
   * Returns a copy of this vector that has a magnitude of 1.
   *
   * @return {Vector2} A copy of this vector that has a magnitude of 1.
   * @memberof Vector2
   */
  normalized() {
    return this.clone().normalize();
  }

  /**
   * Returns a copy of this 2D vector.
   *
   * @return {Vector2} A copy of this 2D vector.
   * @memberof Vector2
   */
  clone() {
    return new Vector2(this.x, this.y);
  }

  /**
   * Sets the X and Y component of this 2D vector.
   *
   * @param {number} x X component of this 2D vector.
   * @param {number} y Y component of this 2D vector.
   * @return {Vector2} The 2D vector itself.
   * @memberof Vector2
   */
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Makes this 2D vector have a magnitude of 1.
   *
   * @return {Vector2} The 2D vector itself.
   * @memberof Vector2
   */
  normalize() {
    const mag = this.magnitude();

    if (mag > Number.EPSILON) {
      return this.divide(mag);
    } else {
      return this.set(0, 0);
    }
  }

  /**
   * Returns a shortcut for writing Vector2(0, 0).
   *
   * @static
   * @return {Vector2} A shortcut for writing Vector2(0, 0).
   * @memberof Vector2
   */
  static get zero() {
    return new Vector2(0, 0);
  }

  /**
   * Returns a shortcut for writing Vector2(1, 1).
   *
   * @static
   * @return {Vector2} A shortcut for writing Vector2(1, 1).
   * @memberof Vector2
   */
  static get one() {
    return new Vector2(1, 1);
  }

  /**
   * Returns a shortcut for writing Vector2(Infinity, Infinity).
   *
   * @static
   * @return {Vector2} A shortcut for writing Vector2(Infinity, Infinity).
   * @memberof Vector2
   */
  static get positiveInfinity() {
    return new Vector2(Infinity, Infinity);
  }

  /**
   * Returns a shortcut for writing Vector2(-Infinity, -Infinity).
   *
   * @static
   * @return {Vector2} A shortcut for writing Vector2(-Infinity, -Infinity).
   * @memberof Vector2
   */
  static get negativeInfinity() {
    return new Vector2(-Infinity, -Infinity);
  }

  /**
   * Returns a shortcut for writing Vector2(0, -1).
   *
   * @static
   * @return {Vector2} A shortcut for writing Vector2(0, -1).
   * @memberof Vector2
   */
  static get up() {
    return new Vector2(0, -1);
  }

  /**
   * Returns a shortcut for writing Vector2(1, 0).
   *
   * @static
   * @return {Vector2} A shortcut for writing Vector2(1, 0).
   * @memberof Vector2
   */
  static get right() {
    return new Vector2(1, 0);
  }

  /**
   * Returns a shortcut for writing Vector2(0, 1).
   *
   * @static
   * @return {Vector2} A shortcut for writing Vector2(0, 1).
   * @memberof Vector2
   */
  static get down() {
    return new Vector2(0, 1);
  }

  /**
   * Returns a shortcut for writing Vector2(-1, 0).
   *
   * @static
   * @return {Vector2} A shortcut for writing Vector2(-1, 0).
   * @memberof Vector2
   */
  static get left() {
    return new Vector2(-1, 0);
  }

  /**
   * Returns the angle between two 2D vectors in degrees.
   *
   * @static
   * @param {Vector2} from 2D vector to start from.
   * @param {Vector2} to 2D vector to end to.
   * @return {number} The angle between two 2D vectors in degrees.
   * @memberof Vector2
   */
  static angle(from, to) {
    const n = Vector2.dot(from.normalized(), to.normalized());
    return Math.acos(clamp(n, -1, 1)) * MATH_CONST.RAD_TO_DEG;
  }

  /**
   * Returns the angle ABC in radians defined by three points, ABC.
   * 
   * @static
   * @param {Vector2} pointA
   * @param {Vector2} pointB 
   * @param {Vector2} pointC 
   * @returns 
   * 
   * @memberOf Vector2
   */
  static angle3(pointA, pointB, pointC) {
    return Math.atan2(pointB.y - pointC.y, pointB.x - pointC.x) -
    Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
  }

  /**
   * Returns a copy of this 2D vector with its magnitude clamped to maxLength.
   *
   * @static
   * @param {Vector2} vector 2D vector to clamp.
   * @param {number} maxLength Max magnitude of the 2D vector.
   * @return {Vector2} A copy of the 2D vector with its magnitude clamped to
   * maxLength.
   * @memberof Vector2
   */
  static clampMagnitude(vector, maxLength) {
    if (vector.sqrMagnitude() > maxLength * maxLength) {
      return vector.normalized() * maxLength;
    } else {
      return vector;
    }
  }

  /**
   * Returns the distance between two 2D vectors.
   *
   * @static
   * @param {Vector2} from 2D vector to start from.
   * @param {Vector2} to 2D vector to end to.
   * @return {number} The distance between two 2D vectors.
   * @memberof Vector2
   */
  static distance(from, to) {
    return from
        .clone()
        .subtract(to)
        .magnitude();
  }

  /**
   * Returns the dot product of two 2D vectors.
   *
   * @static
   * @param {Vector2} lhs Left hand side of equation.
   * @param {Vector2} rhs Right hand side of equation.
   * @return {number} The dot product of two 2D vectors.
   * @memberof Vector2
   */
  static dot(lhs, rhs) {
    return lhs.x * rhs.y + lhs.y * rhs.y;
  }

  /**
   * Linearly interpolates between `v1` and `v2` by `t`.
   *
   * @static
   * @param {Vector2} v1 First vector.
   * @param {Vector2} v2 Second vector.
   * @param {number} t Interpolation factor.
   * @return {Vector2} Linear interpolation between `v1` and `v2` by `t`.
   * @memberof Vector2
   */
  static lerp(v1, v2, t) {
    return this.unclampedLerp(v1, v2, clamp(t, 0, 1));
  }

  /**
   * Linearly interpolates between `v1` and `v2` by `t`.
   *
   * @static
   * @param {Vector2} v1 First vector.
   * @param {Vector2} v2 Second vector.
   * @param {number} t Interpolation factor.
   * @return {Vector2} Linear interpolation between `v1` and `v2` by `t`.
   * @memberof Vector2
   */
  static unclampedLerp(v1, v2, t) {
    return new Vector2(v1.x + (v2.x - v1.x) * t, v1.y + (v2.y - v1.y) * t);
  }

  /**
   * Returns a 2D vector made from the highest values of each component of the
   * two 2D vectors.
   *
   * @static
   * @param {Vector2} lhs Left hand side of equation.
   * @param {Vector2} rhs Right hand side of equation.
   * @return {Vector2} A 2D vector made from the highest values of each
   * component of the two 2D vectors.
   * @memberof Vector2
   */
  static max(lhs, rhs) {
    return new Vector2(Math.max(lhs.x, rhs.x), Math.max(lhs.y, rhs.y));
  }

  /**
   * Returns a 2D vector made from the lowest values of each component of the
   * two 2D vectors.
   *
   * @static
   * @param {Vector2} lhs Left hand side of equation.
   * @param {Vector2} rhs Right hand side of equation.
   * @return {Vector2} A 2D vector made from the lowest values of each component
   * of the two 2D vectors.
   * @memberof Vector2
   */
  static min(lhs, rhs) {
    return new Vector2(Math.min(lhs.x, rhs.x), Math.min(lhs.y, rhs.y));
  }

  /**
   * Moves a 2D vector towards another 2D vector.
   *
   * @static
   * @param {Vector2} current 2D vector to start from.
   * @param {Vector2} target 2D vector to travel to.
   * @param {Vector2} maxDistanceDelta Max distance to travel
   * @return {Vector2} Finished distance from one call.
   * @memberof Vector2
   */
  static moveTowards(current, target, maxDistanceDelta) {
    const difference = target.clone().subtract(current);
    const distance = difference.magnitude();

    if (distance <= maxDistanceDelta || distance < Number.EPSILON) {
      return target;
    } else {
      return difference
          .clone()
          .divide(distance)
          .multiply(maxDistanceDelta)
          .add(current);
    }
  }

  /**
   * Returns the 2D vector perpendicular to this 2D vector.
   *
   * @static
   * @param {Vector2} direction Input direction.
   * @return {Vector2} Vector perpendicular to this vector.
   * @memberof Vector2
   */
  static perpendicular(direction) {
    return new Vector2(-direction.y, direction.x);
  }

  /**
   * Proejcts a vector unto another vector.
   *
   * @static
   * @param {Vector2} vector Vector to project.
   * @param {Vector2} onNormal Vector to project unto.
   * @return {Vector2} Proejction of a vector unto another vector.
   * @memberof Vector2
   */
  static project(vector, onNormal) {
    const sqrMag = onNormal.sqrMagnitude();
    if (sqrMag < Number.EPSILON) {
      return 0;
    } else {
      return onNormal * Vector2.dot(vector, onNormal) / sqrMag;
    }
  }

  /**
   * Reflects a vector off the vector defined by a normal.
   *
   * @static
   * @param {Vector2} direction Input direction.
   * @param {Vector2} normal Input normal.
   * @return {Vector2} Reflection of a vector off the vector defined by a
   * normal.
   * @memberof Vector2
   */
  static reflect(direction, normal) {
    return direction
        .clone()
        .multiply(-2 * Vector2.dot(normal, direction))
        .add(direction);
  }

  /**
   * Multiplies two 2D vectors component-wise.
   *
   * @static
   * @param {Vector2} lhs Left hand side of equation.
   * @param {Vector2} rhs Right hand side of equation.
   * @return {Vector2} The product of two 2D vectors component-wise.
   * @memberof Vector2
   */
  static scale(lhs, rhs) {
    return new Vector2(lhs.x * rhs.x, lhs.y * rhs.y);
  }

  /**
   * Returns the signed angle between two 2D vectors in degrees.
   *
   * @static
   * @param {Vector2} from Vector to start from.
   * @param {Vector2} to Vector to travel to.
   * @return {number} The angle between two 2D vectors in degrees.
   * @memberof Vector2
   */
  static signedAngle(from, to) {
    return Vector2.angle(from, to) * Math.sign(from.x * to.y - from.y * to.x);
  }
}

export default Vector2;
