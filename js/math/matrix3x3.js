import MATH_CONST from './const.js';
import Vector2 from './vector2.js';

class Matrix3x3 {
  // #row#col
  constructor(m00=0, m01=0, m02=0, m10=0, m11=0, m12=0, m20=0, m21=0, m22=0) {
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

  get determinant() {
		return this.m00 * (this.m00 * this.m11 - this.m01 * this.m10)
		- this.m01 * (this.m10 * this.m11 - this.m01 * this.m20)
		+ this.m02 * (this.m10 * this.m10 - this.m00 * this.m20);
	}

	get inverse() {
		const determinant = this.determinant;

		if (determinant == 0)
			throw new Error("Can't invert matrix with determinant 0");
			
		const invdet = 1 / determinant;
		return new Matrix3x3 (
      (this.m00 * this.m11 - this.m10 * this.m01) * invdet, (this.m10 * this.m02 - this.m01 * this.m11) * invdet, (this.m01 * this.m01 - this.m00 * this.m02) * invdet,
      (this.m20 * this.m01 - this.m10 * this.m11) * invdet, (this.m00 * this.m11 - this.m20 * this.m02) * invdet, (this.m10 * this.m02 - this.m00 * this.m01) * invdet,
      (this.m10 * this.m10 - this.m20 * this.m00) * invdet, (this.m20 * this.m01 - this.m00 * this.m10) * invdet, (this.m00 * this.m00 - this.m10 * this.m01) * invdet,
    );
  }

  get transpose() {
    return new Matrix3x3(
      this.m00, this.m10, this.m20,
      this.m01, this.m11, this.m21,
      this.m02, this.m12, this.m22
    );
  }
  
  /**
   * @param {Vector2} vector2
   */
  multiplyVector2(vector2) {
    return new Vector2(
      this.m00 * vector2.x + this.m01 * vector2.y + this.m02,
      this.m10 * vector2.x + this.m11 * vector2.y + this.m12
    );
  }

  /**
   * @param {Matrix3x3} matrix
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
   * @param {Vector2} translation
   */
  static createTranslation(translation) {
    return new Matrix3x3(
      1, 0, translation.x,
      0, 1, translation.y,
      0, 0, 1
    );
  }

  /**
   * @param {number} rotation
   */
  static createRotation(rotation) {
    const cos = Math.cos(rotation * MATH_CONST.DEG_TO_RAD);
		const sin = Math.sin(rotation * MATH_CONST.DEG_TO_RAD);

    // rotate clockwise
		return new Matrix3x3(
      cos, -sin, 0,
      sin, cos, 0,
      0, 0, 1
    );
  }

  /**
   * @param {Vector2} scale
   */
  static createScale(scale) {
    return new Matrix3x3 (
      scale.x, 0, 0,
      0, scale.y, 0,
      0, 0, 1,
    );
  }

  /**
   * Creates a Matrix3x3 from the translation, rotation, and scale parameters.
   * @param {Vector2} translation
   * @param {number} rotation
   * @param {Vector2} scale
   * @return {Matrix3x3} Matrix created from translation, rotation, and scale.
   */
  static createTRS(translation, rotation, scale) {
    const cos = Math.cos(rotation * MATH_CONST.DEG_TO_RAD);
		const sin = Math.sin(rotation * MATH_CONST.DEG_TO_RAD);

    return new Matrix3x3(
      scale.x * cos, scale.y * -sin, translation.x,
      scale.x * sin, scale.y * cos, translation.y,
      0, 0, 1,
    );
  }
}

export default Matrix3x3;
