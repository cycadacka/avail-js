import Component from '../../core/component.js';
import Vector2D from '../../math/vector2d.js';
import Transform from '../transform.js';
import {wrap} from '../../math/math.js';

/**
 * Returns the sign of the mathematical function for getting the area of a
 * triangle defined by three points.
 *
 * @ignore
 * @param {Vector2D} pointA
 * @param {Vector2D} pointB
 * @param {Vector2D} pointC
 * @return {number}
 */
function getTriangleArea(pointA, pointB, pointC) {
  return Math.sign(
    pointA.x * (pointB.y - pointC.y) +
    pointB.x * (pointC.y - pointA.y) +
    pointC.x * (pointA.y - pointB.y),
  );
}

/**
 * Returns true if the polygon is clockwise.
 *
 * @ignore
 * @param {Vector2D[]} vertices
 * @return {boolean}
 */
function isClockwise(vertices) {
  let sum = 0;

  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;

    sum += vertices[i].x * vertices[j].y - vertices[i].y + vertices[j].x;
  }

  return sum > 0;
}

/**
 * @template T
 * @typedef {object} ArrayProxy
 * @property {(index: number) => T} get
 * @property {number} length
 */

/**
 * Represents a simple polygon.
 *
 * @class SimplePolygon
 */
class SimplePolygon extends Component {
  /**
   * Creates an instance of SimplePolygon.
   *
   * @param {Vector2D[]} vertices
   * @param {boolean} [clockwise]
   * @memberof SimplePolygon
   */
  constructor(vertices, clockwise=null) {
    super();

    if (vertices.length < 3) {
      throw new Error(
        'SimplePolygon cannot be constructed with less than 3 vertices',
      );
    }

    /** @type {Vector2D[]} */
    this.vertices = Object.seal(vertices);
    if (clockwise == null) {
      clockwise = isClockwise(this.vertices);
    }
    this.clockwise = clockwise;

    this.partition = {
      triangle() {
        /**
         * @ignore
         * @param {number} index
         * @return {number}
         */
        function __getTriangleArea(index) {
          return getTriangleArea(
            vertices[wrap(index - 1, 0, vertices.length)],
            vertices[index],
            vertices[wrap(index + 1, 0, vertices.length)],
          );
        }

        const cvertices = [...vertices];
        /** @type {Set<number>} */
        const rvertices = new Set();

        const triangles = [];

        while (cvertices.length >= 3 && cvertices.length > rvertices.size) {
          const previous = cvertices[cvertices.length - 1];
          const current = cvertices.shift();
          const next = cvertices[0];

          // const previousIndex = cvertices.length;
          const currentIndex = (
            vertices.length - (cvertices.length - rvertices.size) - 1
          );
          let isCurrentReflex = __getTriangleArea(currentIndex) < 0;
          // const nextIndex = vertices.length - cvertices.length;

          if (!clockwise) {
            isCurrentReflex = !isCurrentReflex;
          }

          if (isCurrentReflex) {
            rvertices.add(currentIndex);
            // skip current vertex and put it at top
            cvertices.push(current);
          } else {
            triangles.push([previous, current, next]);
          }
        }

        return triangles;
      },
      convex() {
      },
    };
  }

  /**
   * Retrieves a proxy for the edges.
   *
   * @type {ArrayProxy<
   *   {start: Vector2D, end: Vector2D, readonly normal: Vector2D}
   * >}
   * @readonly
   * @memberof SimplePolygon
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
   * Retrieves the object-aligned bounding box for a polygon.
   *
   * @virtual
   * @readonly
   * @memberof SimplePolygon
   */
  get obb() {
    const min = new Vector2D(Infinity, Infinity);
    const max = new Vector2D(Infinity, Infinity).negative();

    for (let i = 0; i < this.vertices.length; i++) {
      const vertex = this.vertices[i];

      if (vertex.x < min.x) {
        min.x = vertex.x;
      }

      if (vertex.x > max.x) {
        max.x = vertex.x;
      }

      if (vertex.y < min.y) {
        min.y = vertex.y;
      }

      if (vertex.y > max.y) {
        max.y = vertex.y;
      }
    }

    return {min, max};
  }
}

SimplePolygon.ATTRIBUTES = {
  SINGLE: true,
  REQUIRES: [
    Transform,
  ],
};

export default SimplePolygon;
