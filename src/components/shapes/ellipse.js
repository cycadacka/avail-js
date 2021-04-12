import Shape from './package/shape.js';

/**
 * Represents an ellipse.
 *
 * @class Ellipse
 * @extends {Shape}
 */
class Ellipse extends Shape {
  /**
   * Creates an instance of Ellipse.
   *
   * @param {number} radiusX
   * @param {number} radiusY
   * @memberof Circle
   */
  constructor(radiusX, radiusY) {
    super();

    this.radiusX = radiusX;
    this.radiusY = radiusY;
  }
}

Ellipse.ATTRIBUTES.REQUIRES = [Transform];

export default Ellipse;
