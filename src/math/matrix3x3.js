import {DEG_TO_RAD} from './math.js';
import Vector2D from './vector2d.js';

/**
 * Representation of a 3x3 transformation matrix.
 *
 * @class Matrix3x3
 */
class Matrix3x3 {
  /**
   * Creates an instance of Matrix3x3.
   *
   * @param {number} [m00=0]
   * @param {number} [m01=0]
   * @param {number} [m02=0]
   * @param {number} [m10=0]
   * @param {number} [m11=0]
   * @param {number} [m12=0]
   * @param {number} [m20=0]
   * @param {number} [m21=0]
   * @param {number} [m22=0]
   * @memberof Matrix3x3
   */
  constructor(m00=0, m01=0, m02=0, m10=0, m11=0, m12=0, m20=0, m21=0, m22=0) {
    // #row#col
    this.m00 = m00;
    this.m01 = m01;
    this.m02 = m02;

    this.m10 = m10;
    this.m11 = m11;
    this.m12 = m12;

    this.m20 = m20;
    this.m21 = m21;
    this.m22 = m22;
  }

  /**
   * The determinant of the matrix.
   *
   * @readonly
   * @memberof Matrix3x3
   */
  get determinant() {
    return this.m00 * (this.m00 * this.m11 - this.m01 * this.m10) -
    this.m01 * (this.m10 * this.m11 - this.m01 * this.m20) +
    this.m02 * (this.m10 * this.m10 - this.m00 * this.m20);
  }

  /**
  * The inverse of this matrix.
  *
  * @readonly
  * @memberof Matrix3x3
  */
  get inverse() {
    const determinant = this.determinant;

    if (determinant == 0) {
      throw new Error('Can\'t invert matrix whose determinant is 0.');
    }

    const invdet = 1 / determinant;
    return new Matrix3x3(
      (this.m00 * this.m11 - this.m10 * this.m01) * invdet,
      (this.m10 * this.m02 - this.m01 * this.m11) * invdet,
      (this.m01 * this.m01 - this.m00 * this.m02) * invdet, // Row 1
      (this.m20 * this.m01 - this.m10 * this.m11) * invdet,
      (this.m00 * this.m11 - this.m20 * this.m02) * invdet,
      (this.m10 * this.m02 - this.m00 * this.m01) * invdet, // Row 2
      (this.m10 * this.m10 - this.m20 * this.m00) * invdet,
      (this.m20 * this.m01 - this.m00 * this.m10) * invdet,
      (this.m00 * this.m00 - this.m10 * this.m01) * invdet, // Row 3
    );
  }

  /**
   * Returns the transpose of this matrix.
   *
   * @readonly
   * @memberof Matrix3x3
   */
  get transpose() {
    return new Matrix3x3(
      this.m00, this.m10, this.m20,
      this.m01, this.m11, this.m21,
      this.m02, this.m12, this.m22,
    );
  }

  /**
   * Transforms a position by this matrix.
   *
   * @param {Vector2D} vector2d
   * @return {Vector2D}
   * @memberof Matrix3x3
   */
  multiplyVector2(vector2d) {
    return new Vector2D(
      this.m00 * vector2d.x + this.m01 * vector2d.y + this.m02,
      this.m10 * vector2d.x + this.m11 * vector2d.y + this.m12,
    );
  }

  /**
   * Multiplies two matrices.
   *
   * @param {Matrix3x3} matrix
   * @return {Matrix3x3}
   * @memberof Matrix3x3
   */
  multiplyMatrix3x3(matrix) {
    return new Matrix3x3(
      this.m00 * matrix.m00 + this.m10 * matrix.m01 + this.m20 * matrix.m02,
      this.m01 * matrix.m00 + this.m11 * matrix.m01 + this.m21 * matrix.m02,
      this.m02 * matrix.m00 + this.m12 * matrix.m01 + this.m22 * matrix.m02,
      this.m00 * matrix.m10 + this.m10 * matrix.m11 + this.m20 * matrix.m12,
      this.m01 * matrix.m10 + this.m11 * matrix.m11 + this.m21 * matrix.m12,
      this.m02 * matrix.m10 + this.m12 * matrix.m11 + this.m22 * matrix.m12,
      this.m00 * matrix.m20 + this.m10 * matrix.m21 + this.m20 * matrix.m22,
      this.m01 * matrix.m20 + this.m11 * matrix.m21 + this.m21 * matrix.m22,
      this.m02 * matrix.m20 + this.m12 * matrix.m21 + this.m22 * matrix.m22,
    );
  }

  /**
   * Creates a translation matrix.
   *
   * @param {Vector2D} translation
   * @return {Matrix3x3}
   * @memberof Matrix3x3
   */
  static createTranslation(translation) {
    return new Matrix3x3(
      1, 0, translation.x,
      0, 1, translation.y,
      0, 0, 1,
    );
  }

  /**
   * Creates a rotation matrix.
   *
   * @static
   * @param {number} rotation
   * @return {Matrix3x3}
   * @memberof Matrix3x3
   */
  static createRotation(rotation) {
    const cos = Math.cos(rotation * DEG_TO_RAD);
    const sin = Math.sin(rotation * DEG_TO_RAD);

    // clockwise
    return new Matrix3x3(
      cos, -sin, 0,
      sin, cos, 0,
      0, 0, 1,
    );
  }

  /**
   * Creates a scaling matrix.
   *
   * @static
   * @param {Vector2D} scale
   * @return {Matrix3x3}
   * @memberof Matrix3x3
   */
  static createScale(scale) {
    return new Matrix3x3(
      scale.x, 0, 0,
      0, scale.y, 0,
      0, 0, 1,
    );
  }

  /**
   * Creates a translation, rotation and scaling matrix.
   *
   * @param {Vector2D} translation
   * @param {number} rotation
   * @param {Vector2D} scale
   * @return {Matrix3x3}
   */
  static createTRS(translation, rotation, scale) {
    const cos = Math.cos(rotation * DEG_TO_RAD);
    const sin = Math.sin(rotation * DEG_TO_RAD);

    return new Matrix3x3(
      scale.x * cos, scale.y * -sin, translation.x,
      scale.x * sin, scale.y * cos, translation.y,
      0, 0, 1,
    );
  }
}

export default Matrix3x3;
