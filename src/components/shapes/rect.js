import Vector2D from '../../math/vector2d.js';
import Polygon from './polygon.js';

/**
 * Represents a rectangle.
 *
 * @class Rect
 * @extends {Polygon}
 */
class Rect extends Polygon {
  /**
   * Creates an instance of Rect.
   *
   * @param {number} width
   * @param {number} height
   * @memberof Rect
   */
  constructor(width, height) {
    super((function() {
      const halfWidth = width / 2;
      const halfHeight = height / 2;
      return [
        new Vector2D(-halfWidth, -halfHeight),
        new Vector2D(halfWidth, -halfHeight),
        new Vector2D(halfWidth, halfHeight),
        new Vector2D(-halfWidth, halfHeight),
      ];
    })(), true);
  }
}

export default Rect;
