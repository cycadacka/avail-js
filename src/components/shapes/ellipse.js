import Vector2D from '../../math/vector2d.js';
import SimplePolygon from './simple-polygon.js';

/**
 * Converts an ellipse to a polygon.
 *
 * @ignore
 * @param {number} x
 * @param {number} y
 * @param {number} resolution
 * @return {Vector2D[]}
 */
function ellipseToPolygon(x, y, resolution) {
  const vertices = [];

  for (let i = 0; i <= resolution; i++) {
    const angle = i / resolution * 2.0 * Math.PI;
    vertices.push(new Vector2D(x * Math.cos(angle), y * Math.sin(angle)));
  }

  return vertices;
}

/**
 * Represents an ellipse.
 *
 * @class Ellipse
 * @extends {SimplePolygon}
 */
class Ellipse extends SimplePolygon {
  /**
   * Creates an instance of Ellipse.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} [resolution]
   * @memberof Ellipse
   */
  constructor(x, y, resolution=36) {
    super(ellipseToPolygon(x, y, resolution));

    this.radius = new Vector2D(x, y);
  }

  /**
   * @override
   * @memberof Ellipse
   */
  get obb() {
    return {
      min: new Vector2D(-this.radius.x, -this.radius.y),
      max: new Vector2D(this.radius.x, this.radius.y),
    };
  }

  /**
   * Update the ellipse in according the changed properties.
   *
   * @memberof Ellipse
   */
  update() {
    const updated = ellipseToPolygon(
      this.radius.x, this.radius.y, this.vertices.length,
    );
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i] = updated[i];
    }
  }
}

export default Ellipse;
