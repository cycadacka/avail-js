import Vector2D from '../../math/vector2d.js';
import SimplePolygon from './simple-polygon.js';

/**
 * Converts a rectangle into a polygon (vertices).
 *
 * @ignore
 * @param {number} width
 * @param {number} height
 * @return {Vector2D[]}
 */
function rectToPolygon(width, height) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  return [
    [-halfWidth, -halfHeight],
    [halfWidth, -halfHeight],
    [halfWidth, halfHeight],
    [-halfWidth, halfHeight],
  ];
}

/**
 * Represents a rectangle.
 *
 * @class Rect
 * @extends {SimplePolygon}
 */
class Rect extends SimplePolygon {
  /**
   * Creates an instance of Rect.
   *
   * @param {number} width
   * @param {number} height
   * @memberof Rect
   */
  constructor(width, height) {
    super(rectToPolygon(width, height), true);

    this.width = width;
    this.height = height;
  }

  /**
   * @override
   * @memberof Rect
   */
  get obb() {
    return {
      min: new Vector2D(this.vertices[0].x, this.vertices[0].y),
      max: new Vector2D(this.vertices[2].x, this.vertices[2].y),
    };
  }

  /**
   * Update the rectangle in according the changed properties.
   *
   * @memberof Rect
   */
  update() {
    const updated = rectToPolygon(this.width, this.height);
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i] = updated[i];
    }
  }
}

export default Rect;
