import Component from '../../core/component.js';
import Vector2D from '../../math/vector2d.js';
import Transform from '../transform.js';

/**
 * Returns true if the polygon is clockwise.
 *
 * @ignore
 * @param {Vector2D[]} vertices
 * @return {boolean}
 */
function isClockwise(vertices) {
  let area = 0;

  for (let i = 0; i < (vertices.length); i++) {
    const j = (i + 1) % vertices.length;

    area += vertices[i].x * vertices[j].y;
    area -= vertices[j].x * vertices[i].y;
  }

  return area < 0;
}

/**
 * @template T
 * @typedef {object} ArrayProxy
 * @property {(index: number) => T} get
 * @property {number} length
 */

/**
 * Represents a polygon.
 *
 * @class Polygon
 * @extends {Component}
 */
class Polygon extends Component {
  /**
   * Creates an instance of Polygon.
   *
   * @param {Vector2D} vertices
   * @param {boolean} [clockwise]
   * @memberof Polygon
   */
  constructor(vertices, clockwise=undefined) {
    super();

    if (vertices.length < 3) {
      throw new Error(
        'Polygon cannot be constructed with less than 3 vertices',
      );
    }

    /** @type {Vector2D[]} */
    this._vertices = vertices;
    this._clockwise = clockwise;
  }

  /**
   * Retrieves a proxy for the vertices.
   *
   * @type {ArrayProxy<Vector2D>}
   * @readonly
   * @memberof Polygon
   */
  get vertices() {
    const self = this;
    return {
      get(index) {
        return self._vertices[index];
      },
      length: self._vertices.length,
    };
  }

  /**
   * Retrieves a proxy for the edges.
   *
   * @type {ArrayProxy<
   *   {start: Vector2D, end: Vector2D, readonly normal: Vector2D}
   * >}
   * @readonly
   * @memberof Polygon
   */
  get edges() {
    const self = this;

    return {
      get(index) {
        const start = self._vertices[index];
        const end = self._vertices[(index + 1) % self._vertices.length];
        return {
          start,
          end,
          get normal() {
            const dir = end.subtract(start).normalized();
            return self._clockwise ?
              new Vector2D(-dir.y, dir.x) : new Vector2D(dir.y, -dir.x);
          },
        };
      },
      length: self._vertices.length,
    };
  }

  /**
   * Returns true if the polygon is clockwise.
   *
   * @type {boolean}
   * @readonly
   * @memberof Polygon
   */
  get clockwise() {
    if (!this._clockwise) {
      this._clockwse = isClockwise(this._vertices);
    }

    return this._clockwise;
  }
}

Polygon.ATTRIBUTES = {
  REQUIRES: [
    Transform,
  ],
};

export default Polygon;
