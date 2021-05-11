import { RAD_TO_DEG, clamp } from './math';

/**
 * Representation of 2D vectors and points.
 *
 * Inspired by Unity [game engine] developed by Unity Technologies
 */
class Vector2D {
  public x: number;
  public y: number;

  /**
   * Creates an instance of Vector2d.
   *
   * @param x X component of the 2D vector.
   * @param y Y component of the 2D vector.
   * @memberof Vector2d
   */
  constructor(x: number, y: number) {
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
   * @return The 2D vector itself. 
   * @memberof Vector2d
   */
  negative(): Vector2D {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  /**
   * Adds this 2D vector to another 2D vector.
   *
   * @param vector 2D vector to add to this 2D vector.
   * @return The 2D vector itself.
   * @memberof Vector2d
   */
  add(vector: Vector2D): Vector2D {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  /**
   * Subtracts this 2D vector by another 2D vector.
   *
   * @param vector 2D vector to subtract to this 2D vector.
   * @return The 2D vector itself.
   * @memberof Vector2d
   */
  subtract(vector: Vector2D): Vector2D {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  /**
   * Divides this 2D vector by a number
   *
   * @param n Any number to divide by.
   * @return The 2D vector itself.
   * @memberof Vector2d
   */
  divide(n: number): Vector2D {
    this.x /= n;
    this.y /= n;
    return this;
  }

  /**
   * Multiplies this 2D vector by a number
   *
   * @param n Any number to multiply by.
   * @return The 2D vector itself.
   * @memberof Vector2d
   */
  multiply(n: number): Vector2D {
    this.x *= n;
    this.y *= n;
    return this;
  }

  /**
   * Compares this 2D vector to another 2D vector if they are the same.
   *
   * @param vector 2D vector to compare to this 2D vector.
   * @return If this 2D vector and another 2D vector are the same.
   * @memberof Vector2d
   */
  equals(vector: Vector2D): boolean {
    return (
      this.clone()
        .subtract(vector)
        .sqrMagnitude < Number.EPSILON
    );
  }

  /**
   * Compares this 2D vector to another 2D vector if they are not the same.
   *
   * @param vector 2D vector to compare to this 2D vector.
   * @return If this 2D vector and another 2D vector are not the same.
   * @memberof Vector2d
   */
  notEquals(vector: Vector2D): boolean {
    return (
      this.clone()
        .subtract(vector)
        .sqrMagnitude >= Number.EPSILON
    );
  }

  /**
   * Returns a string representation of this 2D vector.
   *
   * @param [radix] Base to use for representing a numeric value
   * @return String representation of a 2D vector.
   * @memberof Vector2d
   */
  toString(radix: number = 10): string {
    return `(${this.x.toString(radix)}, ${this.y.toString(radix)})`;
  }

  /**
   * Returns the length of the 2D vector.
   *
   * @return The length of the 2D vector.
   * @memberof Vector2d
   */
  get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Returns the squared length of the 2D vector.
   *
   * @return The squared length of the 2D vector.
   * @memberof Vector2d
   */
  get sqrMagnitude(): number {
    return this.x * this.x + this.y + this.y;
  }

  /**
   * Returns a copy of this vector that has a magnitude of 1.
   *
   * @return A copy of this vector that has a magnitude of 1.
   * @memberof Vector2d
   */
  get normalized(): Vector2D {
    return this.clone().normalize();
  }

  /**
   * Returns a copy of this 2D vector.
   *
   * @return A copy of this 2D vector.
   * @memberof Vector2d
   */
  clone(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  /**
   * Sets the X and Y component of this 2D vector.
   *
   * @param x X component of this 2D vector.
   * @param y Y component of this 2D vector.
   * @return The 2D vector itself.
   * @memberof Vector2d
   */
  set(x: number, y: number): Vector2D {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Makes this 2D vector have a magnitude of 1.
   *
   * @return The 2D vector itself.
   * @memberof Vector2d
   */
  normalize(): Vector2D {
    const mag = this.magnitude;

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
   * @return A shortcut for writing Vector2d(0, 0).
   * @memberof Vector2d
   */
  static get zero(): Vector2D {
    return new Vector2D(0, 0);
  }

  /**
   * Returns a shortcut for writing Vector2d(1, 1).
   *
   * @static
   * @return A shortcut for writing Vector2d(1, 1).
   * @memberof Vector2d
   */
  static get one(): Vector2D {
    return new Vector2D(1, 1);
  }

  /**
   * Returns a shortcut for writing Vector2d(Infinity, Infinity).
   *
   * @static
   * @return A shortcut for writing Vector2d(Infinity, Infinity).
   * @memberof Vector2d
   */
  static get positiveInfinity(): Vector2D {
    return new Vector2D(Infinity, Infinity);
  }

  /**
   * Returns a shortcut for writing Vector2d(-Infinity, -Infinity).
   *
   * @static
   * @return A shortcut for writing Vector2d(-Infinity, -Infinity).
   * @memberof Vector2d
   */
  static get negativeInfinity(): Vector2D {
    return new Vector2D(-Infinity, -Infinity);
  }

  /**
   * Returns a shortcut for writing Vector2d(0, -1).
   *
   * @static
   * @return A shortcut for writing Vector2d(0, -1).
   * @memberof Vector2d
   */
  static get up(): Vector2D {
    return new Vector2D(0, -1);
  }

  /**
   * Returns a shortcut for writing Vector2d(1, 0).
   *
   * @static
   * @return A shortcut for writing Vector2d(1, 0).
   * @memberof Vector2d
   */
  static get right(): Vector2D {
    return new Vector2D(1, 0);
  }

  /**
   * Returns a shortcut for writing Vector2d(0, 1).
   *
   * @static
   * @return A shortcut for writing Vector2d(0, 1).
   * @memberof Vector2d
   */
  static get down(): Vector2D {
    return new Vector2D(0, 1);
  }

  /**
   * Returns a shortcut for writing Vector2d(-1, 0).
   *
   * @static
   * @return A shortcut for writing Vector2d(-1, 0).
   * @memberof Vector2d
   */
  static get left(): Vector2D {
    return new Vector2D(-1, 0);
  }

  /**
   * Returns the angle between two 2D vectors in degrees.
   *
   * @static
   * @param from 2D vector to start from.
   * @param to 2D vector to end to.
   * @return The angle between two 2D vectors in degrees.
   * @memberof Vector2d
   */
  static angle(from: Vector2D, to: Vector2D): number {
    const denominator = Math.sqrt(
      Math.abs(from.sqrMagnitude * to.sqrMagnitude),
    );
    if (denominator < 1e-15) {
      return 0;
    }

    const dot = clamp(Vector2D.dot(from, to) / denominator, -1, 1);
    return Math.acos(dot) * RAD_TO_DEG;
  }

  /**
   * Returns a copy of this 2D vector with its magnitude clamped to `maxLength`.
   *
   * @static
   * @param vector 2D vector to clamp.
   * @param maxLength Max magnitude of the 2D vector.
   * @return A copy of the 2D vector with its magnitude clamped to `maxLength`.
   * @memberof Vector2d
   */
  static clampMagnitude(vector: Vector2D, maxLength: number): Vector2D {
    if (vector.sqrMagnitude > maxLength * maxLength) {
      return vector.normalized.multiply(maxLength);
    } else {
      return vector;
    }
  }

  /**
   * Returns the distance between two 2D vectors.
   *
   * @static
   * @param from 2D vector to start from.
   * @param to 2D vector to end to.
   * @return The distance between two 2D vectors.
   * @memberof Vector2d
   */
  static distance(from: Vector2D, to: Vector2D): number {
    return from
      .clone()
      .subtract(to)
      .magnitude;
  }

  /**
   * Returns the dot product of two 2D vectors.
   *
   * @static
   * @param lhs Left hand side of equation.
   * @param rhs Right hand side of equation.
   * @return The dot product of two 2D vectors.
   * @memberof Vector2d
   */
  static dot(lhs: Vector2D, rhs: Vector2D): number {
    return lhs.x * rhs.y + lhs.y * rhs.y;
  }

  /**
   * Linearly interpolates between `v1` and `v2` by `t`.
   *
   * @static
   * @param v1 First vector.
   * @param v2 Second vector.
   * @param t Interpolation factor.
   * @return Linear interpolation between `v1` and `v2` by `t`.
   * @memberof Vector2d
   */
  static lerp(v1: Vector2D, v2: Vector2D, t: number): Vector2D {
    return this.unclampedLerp(v1, v2, clamp(t, 0, 1));
  }

  /**
   * Linearly interpolates between `v1` and `v2` by `t`.
   *
   * @static
   * @param v1 First vector.
   * @param v2 Second vector.
   * @param t Interpolation factor.
   * @return Linear interpolation between `v1` and `v2` by `t`.
   * @memberof Vector2d
   */
  static unclampedLerp(v1: Vector2D, v2: Vector2D, t: number): Vector2D {
    return new Vector2D(v1.x + (v2.x - v1.x) * t, v1.y + (v2.y - v1.y) * t);
  }

  /**
   * Returns a 2D vector made from the highest values of each component of the
   * two 2D vectors.
   *
   * @static
   * @param lhs Left hand side of equation.
   * @param rhs Right hand side of equation.
   * @return A 2D vector made from the highest values of each component of the
   * two 2D vectors.
   * @memberof Vector2d
   */
  static max(lhs: Vector2D, rhs: Vector2D): Vector2D {
    return new Vector2D(Math.max(lhs.x, rhs.x), Math.max(lhs.y, rhs.y));
  }

  /**
   * Returns a 2D vector made from the lowest values of each component of the
   * two 2D vectors.
   *
   * @static
   * @param lhs Left hand side of equation.
   * @param rhs Right hand side of equation.
   * @return A 2D vector made from the lowest values of each component of the
   * two 2D vectors.
   * @memberof Vector2d
   */
  static min(lhs: Vector2D, rhs: Vector2D): Vector2D {
    return new Vector2D(Math.min(lhs.x, rhs.x), Math.min(lhs.y, rhs.y));
  }

  /**
   * Moves a 2D vector towards another 2D vector.
   *
   * @static
   * @param current 2D vector to start from.
   * @param target 2D vector to travel to.
   * @param maxDistanceDelta Max distance to travel
   * @return Finished distance from one call.
   * @memberof Vector2d
   */
  static moveTowards(current: Vector2D, target: Vector2D, maxDistanceDelta: number): Vector2D {
    const difference = target.clone().subtract(current);
    const distance = difference.magnitude;

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
   * @param direction Input direction.
   * @return Vector perpendicular to this vector.
   * @memberof Vector2d
   */
  static perpendicular(direction: Vector2D): Vector2D {
    return new Vector2D(-direction.y, direction.x);
  }

  /**
   * Projects a vector unto another vector.
   *
   * @static
   * @param vector Vector to project.
   * @param onNormal Vector to project unto.
   * @return Projection of a vector unto another vector.
   * @memberof Vector2d
   */
  static project(vector: Vector2D, onNormal: Vector2D): Vector2D {
    const sqrMag = onNormal.sqrMagnitude;
    if (sqrMag < Number.EPSILON) {
      return Vector2D.zero;
    } else {
      return onNormal.multiply(Vector2D.dot(vector, onNormal)).divide(sqrMag);
    }
  }

  /**
   * Reflects a vector off the vector defined by a normal.
   *
   * @static
   * @param direction Input direction.
   * @param normal Input normal.
   * @return Reflection of a vector off the vector defined by a
   * normal.
   * @memberof Vector2d
   */
  static reflect(direction: Vector2D, normal: Vector2D): Vector2D {
    return direction
      .clone()
      .multiply(-2 * Vector2D.dot(normal, direction))
      .add(direction);
  }

  /**
   * Multiplies two 2D vectors component-wise.
   *
   * @static
   * @param lhs Left hand side of equation.
   * @param rhs Right hand side of equation.
   * @return The product of two 2D vectors component-wise.
   * @memberof Vector2d
   */
  static scale(lhs: Vector2D, rhs: Vector2D): Vector2D {
    return new Vector2D(lhs.x * rhs.x, lhs.y * rhs.y);
  }

  /**
   * Returns the signed angle between two 2D vectors in degrees.
   *
   * @static
   * @param from Vector to start from.
   * @param to Vector to travel to.
   * @return The angle between two 2D vectors in degrees.
   * @memberof Vector2d
   */
  static signedAngle(from: Vector2D, to: Vector2D): number {
    return Vector2D.angle(from, to) * Math.sign(from.x * to.y - from.y * to.x);
  }
}

export default Vector2D;
