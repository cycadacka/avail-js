import { DEG_TO_RAD } from './math';
import Vector2D from './vector2d';

/**
 * Representation of a 3x3 transformation matrix.
 *
 * @class Matrix3x3
 */
class Matrix3x3 {
  public m00: number;
  public m01: number;
  public m02: number;

  public m10: number;
  public m11: number;
  public m12: number;

  public m20: number;
  public m21: number;
  public m22: number;

  /**
   * Creates an instance of Matrix3x3.
   *
   * @memberof Matrix3x3
   */
  constructor(
    m00: number = 0,
    m01: number = 0,
    m02: number = 0,
    m10: number = 0,
    m11: number = 0,
    m12: number = 0,
    m20: number = 0,
    m21: number = 0,
    m22: number = 0
  ) {
    // m[row][column]
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
  get determinant(): number {
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
  get inverse(): Matrix3x3 {
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
  get transpose(): Matrix3x3 {
    return new Matrix3x3(
      this.m00, this.m10, this.m20,
      this.m01, this.m11, this.m21,
      this.m02, this.m12, this.m22,
    );
  }

  /**
   * Transforms a position by this matrix (does not mutate the vector).
   *
   * @memberof Matrix3x3
   */
  multiplyVector2(vector2d: Vector2D): Vector2D {
    return new Vector2D(
      this.m00 * vector2d.x + this.m01 * vector2d.y + this.m02,
      this.m10 * vector2d.x + this.m11 * vector2d.y + this.m12,
    );
  }

  /**
   * Multiplies two matrices.
   *
   * @memberof Matrix3x3
   */
  multiplyMatrix3x3(matrix: Matrix3x3): Matrix3x3 {
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
   * @memberof Matrix3x3
   */
  static createTranslation(translation: Vector2D): Matrix3x3 {
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
   * @memberof Matrix3x3
   */
  static createRotation(rotation: number): Matrix3x3 {
    const cos = Math.cos(rotation * DEG_TO_RAD);
    const sin = Math.sin(rotation * DEG_TO_RAD);

    // Clockwise rotation.
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
   * @memberof Matrix3x3
   */
  static createScale(scale: Vector2D): Matrix3x3 {
    return new Matrix3x3(
      scale.x, 0, 0,
      0, scale.y, 0,
      0, 0, 1,
    );
  }

  /**
   * Creates a translation, rotation and scaling matrix.
   *
   * @static
   * @memberof Matrix3x3
   */
  static createTRS(translation: Vector2D, rotation: number, scale: Vector2D): Matrix3x3 {
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
