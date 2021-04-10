import {RAD_TO_DEG, clamp} from './math.js';

/**
 * Representation of 2D vectors and points.
 *
 * Inspired by Unity [game engine] developed by Unity Technologies
 */
class Vector2D {
  /**
   * Creates an instance of Vector2d.
   *
   * @param {number} x X component of the 2D vector.
   * @param {number} y Y component of the 2D vector.
   * @memberof Vector2d
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Iterates over the X and Y components of this 2D vector.
   *
   * @memberof Vector2d
   */
  * [Symbol.iterator]() {
    yield this.x;
    yield this.y;
  }

  /**
   * Makes this 2D vector negative.
   *
   * @memberof Vector2d
   * @return {Vector2D} The 2D vector itself.
   */
  negative() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  /**
   * Adds this 2D vector to another 2D vector.
   *
   * @param {Vector2D} vector 2D vector to add to this 2D vector.
   * @return {Vector2D} The 2D vector itself.
   * @memberof Vector2d
   */
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  /**
   * Subtracts this 2D vector by another 2D vector.
   *
   * @param {Vector2D} vector 2D vector to subtract to this 2D vector.
   * @return {Vector2D} The 2D vector itself.
   * @memberof Vector2d
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
   * @return {Vector2D} The 2D vector itself.
   * @memberof Vector2d
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
   * @return {Vector2D} The 2D vector itself.
   * @memberof Vector2d
   */
  multiply(n) {
    this.x *= n;
    this.y *= n;
    return this;
  }

  /**
   * Compares this 2D vector to another 2D vector if they are the same.
   *
   * @param {Vector2D} vector 2D vector to compare to this 2D vector.
   * @return {boolean} If this 2D vector and another 2D vector are the same.
   * @memberof Vector2d
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
   * @param {Vector2D} vector 2D vector to compare to this 2D vector.
   * @return {boolean} If this 2D vector and another 2D vector are not the same.
   * @memberof Vector2d
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
   * @memberof Vector2d
   */
  toString(radix = 10) {
    return `(${this.x.toString(radix)}, ${this.y.toString(radix)})`;
  }

  /**
   * Returns the length of the 2D vector.
   *
   * @return {number} The length of the 2D vector.
   * @memberof Vector2d
   */
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Returns the squared length of the 2D vector.
   *
   * @return {number} The squared length of the 2D vector.
   * @memberof Vector2d
   */
  sqrMagnitude() {
    return this.x * this.x + this.y + this.y;
  }

  /**
   * Returns a copy of this vector that has a magnitude of 1.
   *
   * @return {Vector2D} A copy of this vector that has a magnitude of 1.
   * @memberof Vector2d
   */
  normalized() {
    return this.clone().normalize();
  }

  /**
   * Returns a copy of this 2D vector.
   *
   * @return {Vector2D} A copy of this 2D vector.
   * @memberof Vector2d
   */
  clone() {
    return new Vector2D(this.x, this.y);
  }

  /**
   * Sets the X and Y component of this 2D vector.
   *
   * @param {number} x X component of this 2D vector.
   * @param {number} y Y component of this 2D vector.
   * @return {Vector2D} The 2D vector itself.
   * @memberof Vector2d
   */
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Makes this 2D vector have a magnitude of 1.
   *
   * @return {Vector2D} The 2D vector itself.
   * @memberof Vector2d
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
   * Returns a shortcut for writing Vector2d(0, 0).
   *
   * @static
   * @return {Vector2D} A shortcut for writing Vector2d(0, 0).
   * @memberof Vector2d
   */
  static get zero() {
    return new Vector2D(0, 0);
  }

  /**
   * Returns a shortcut for writing Vector2d(1, 1).
   *
   * @static
   * @return {Vector2D} A shortcut for writing Vector2d(1, 1).
   * @memberof Vector2d
   */
  static get one() {
    return new Vector2D(1, 1);
  }

  /**
   * Returns a shortcut for writing Vector2d(Infinity, Infinity).
   *
   * @static
   * @return {Vector2D} A shortcut for writing Vector2d(Infinity, Infinity).
   * @memberof Vector2d
   */
  static get positiveInfinity() {
    return new Vector2D(Infinity, Infinity);
  }

  /**
   * Returns a shortcut for writing Vector2d(-Infinity, -Infinity).
   *
   * @static
   * @return {Vector2D} A shortcut for writing Vector2d(-Infinity, -Infinity).
   * @memberof Vector2d
   */
  static get negativeInfinity() {
    return new Vector2D(-Infinity, -Infinity);
  }

  /**
   * Returns a shortcut for writing Vector2d(0, -1).
   *
   * @static
   * @return {Vector2D} A shortcut for writing Vector2d(0, -1).
   * @memberof Vector2d
   */
  static get up() {
    return new Vector2D(0, -1);
  }

  /**
   * Returns a shortcut for writing Vector2d(1, 0).
   *
   * @static
   * @return {Vector2D} A shortcut for writing Vector2d(1, 0).
   * @memberof Vector2d
   */
  static get right() {
    return new Vector2D(1, 0);
  }

  /**
   * Returns a shortcut for writing Vector2d(0, 1).
   *
   * @static
   * @return {Vector2D} A shortcut for writing Vector2d(0, 1).
   * @memberof Vector2d
   */
  static get down() {
    return new Vector2D(0, 1);
  }

  /**
   * Returns a shortcut for writing Vector2d(-1, 0).
   *
   * @static
   * @return {Vector2D} A shortcut for writing Vector2d(-1, 0).
   * @memberof Vector2d
   */
  static get left() {
    return new Vector2D(-1, 0);
  }

  /**
   * Returns the angle between two 2D vectors in degrees.
   *
   * @static
   * @param {Vector2D} from 2D vector to start from.
   * @param {Vector2D} to 2D vector to end to.
   * @return {number} The angle between two 2D vectors in degrees.
   * @memberof Vector2d
   */
  static angle(from, to) {
    const n = Vector2D.dot(from.normalized(), to.normalized());
    return Math.acos(clamp(n, -1, 1)) * RAD_TO_DEG;
  }

  /**
   * Returns the angle ABC in radians defined by three points, ABC.
   *
   * @static
   * @param {Vector2D} pointA
   * @param {Vector2D} pointB
   * @param {Vector2D} pointC
   * @returns
   *
   * @memberOf Vector2d
   */
  static angle3(pointA, pointB, pointC) {
    return Math.atan2(pointB.y - pointC.y, pointB.x - pointC.x) -
    Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
  }

  /**
   * Returns a copy of this 2D vector with its magnitude clamped to maxLength.
   *
   * @static
   * @param {Vector2D} vector 2D vector to clamp.
   * @param {number} maxLength Max magnitude of the 2D vector.
   * @return {Vector2D} A copy of the 2D vector with its magnitude clamped to
   * maxLength.
   * @memberof Vector2d
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
   * @param {Vector2D} from 2D vector to start from.
   * @param {Vector2D} to 2D vector to end to.
   * @return {number} The distance between two 2D vectors.
   * @memberof Vector2d
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
   * @param {Vector2D} lhs Left hand side of equation.
   * @param {Vector2D} rhs Right hand side of equation.
   * @return {number} The dot product of two 2D vectors.
   * @memberof Vector2d
   */
  static dot(lhs, rhs) {
    return lhs.x * rhs.y + lhs.y * rhs.y;
  }

  /**
   * Linearly interpolates between `v1` and `v2` by `t`.
   *
   * @static
   * @param {Vector2D} v1 First vector.
   * @param {Vector2D} v2 Second vector.
   * @param {number} t Interpolation factor.
   * @return {Vector2D} Linear interpolation between `v1` and `v2` by `t`.
   * @memberof Vector2d
   */
  static lerp(v1, v2, t) {
    return this.unclampedLerp(v1, v2, clamp(t, 0, 1));
  }

  /**
   * Linearly interpolates between `v1` and `v2` by `t`.
   *
   * @static
   * @param {Vector2D} v1 First vector.
   * @param {Vector2D} v2 Second vector.
   * @param {number} t Interpolation factor.
   * @return {Vector2D} Linear interpolation between `v1` and `v2` by `t`.
   * @memberof Vector2d
   */
  static unclampedLerp(v1, v2, t) {
    return new Vector2D(v1.x + (v2.x - v1.x) * t, v1.y + (v2.y - v1.y) * t);
  }

  /**
   * Returns a 2D vector made from the highest values of each component of the
   * two 2D vectors.
   *
   * @static
   * @param {Vector2D} lhs Left hand side of equation.
   * @param {Vector2D} rhs Right hand side of equation.
   * @return {Vector2D} A 2D vector made from the highest values of each
   * component of the two 2D vectors.
   * @memberof Vector2d
   */
  static max(lhs, rhs) {
    return new Vector2D(Math.max(lhs.x, rhs.x), Math.max(lhs.y, rhs.y));
  }

  /**
   * Returns a 2D vector made from the lowest values of each component of the
   * two 2D vectors.
   *
   * @static
   * @param {Vector2D} lhs Left hand side of equation.
   * @param {Vector2D} rhs Right hand side of equation.
   * @return {Vector2D} A 2D vector made from the lowest values of each
   * component of the two 2D vectors.
   * @memberof Vector2d
   */
  static min(lhs, rhs) {
    return new Vector2D(Math.min(lhs.x, rhs.x), Math.min(lhs.y, rhs.y));
  }

  /**
   * Moves a 2D vector towards another 2D vector.
   *
   * @static
   * @param {Vector2D} current 2D vector to start from.
   * @param {Vector2D} target 2D vector to travel to.
   * @param {Vector2D} maxDistanceDelta Max distance to travel
   * @return {Vector2D} Finished distance from one call.
   * @memberof Vector2d
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
   * @param {Vector2D} direction Input direction.
   * @return {Vector2D} Vector perpendicular to this vector.
   * @memberof Vector2d
   */
  static perpendicular(direction) {
    return new Vector2D(-direction.y, direction.x);
  }

  /**
   * Proejcts a vector unto another vector.
   *
   * @static
   * @param {Vector2D} vector Vector to project.
   * @param {Vector2D} onNormal Vector to project unto.
   * @return {Vector2D} Proejction of a vector unto another vector.
   * @memberof Vector2d
   */
  static project(vector, onNormal) {
    const sqrMag = onNormal.sqrMagnitude();
    if (sqrMag < Number.EPSILON) {
      return 0;
    } else {
      return onNormal * Vector2D.dot(vector, onNormal) / sqrMag;
    }
  }

  /**
   * Reflects a vector off the vector defined by a normal.
   *
   * @static
   * @param {Vector2D} direction Input direction.
   * @param {Vector2D} normal Input normal.
   * @return {Vector2D} Reflection of a vector off the vector defined by a
   * normal.
   * @memberof Vector2d
   */
  static reflect(direction, normal) {
    return direction
      .clone()
      .multiply(-2 * Vector2D.dot(normal, direction))
      .add(direction);
  }

  /**
   * Multiplies two 2D vectors component-wise.
   *
   * @static
   * @param {Vector2D} lhs Left hand side of equation.
   * @param {Vector2D} rhs Right hand side of equation.
   * @return {Vector2D} The product of two 2D vectors component-wise.
   * @memberof Vector2d
   */
  static scale(lhs, rhs) {
    return new Vector2D(lhs.x * rhs.x, lhs.y * rhs.y);
  }

  /**
   * Returns the signed angle between two 2D vectors in degrees.
   *
   * @static
   * @param {Vector2D} from Vector to start from.
   * @param {Vector2D} to Vector to travel to.
   * @return {number} The angle between two 2D vectors in degrees.
   * @memberof Vector2d
   */
  static signedAngle(from, to) {
    return Vector2D.angle(from, to) * Math.sign(from.x * to.y - from.y * to.x);
  }
}

export default Vector2D;
