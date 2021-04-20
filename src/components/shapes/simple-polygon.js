import Component from '../../core/component.js';
import Vector2D from '../../math/vector2d.js';
import Transform from '../transform.js';
import {Vertex} from './package/vertex.js';

/**
 * @template T
 * @typedef {{
 *   [Symbol.iterator]: Generator<T, void, void>,
 *   get(index: number): T,
 *   length: number,
 * }} ArrayProxy
 */

/**
 * @typedef Edge
 * @property {Vertex} start
 * @property {Vertex} end
 * @property {readonly Vector2D} normal
 */

/**
 * Returns true if the polygon is clockwise.
 *
 * @ignore
 * @param {Vertex[]} vertices
 * @return {boolean}
 */
function getPolygonArea(vertices) {
  let area = 0;

  for (let i = 0; i < vertices.length; i++) {
    const previous = vertices[i].previous;
    area += (previous.x + vertices[i].x) * (previous.y + vertices[i].y);
  }

  return area > 0;
}

/**
 * Represents a simple polygon.
 *
 * @class SimplePolygon
 */
class SimplePolygon extends Component {
  /**
   * Creates an instance of SimplePolygon.
   *
   * @param {[number, number][]} vertices
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

    /** @type {Vertex[]} */
    const convert = [];
    for (let i = 0; i < vertices.length; i++) {
      convert.push(new Vertex(vertices[i][0], vertices[i][1]));

      if (i > 0) {
        // set [i].previous && [i - 1].next
        convert[i - 1].next = convert[i];
        convert[i].previous = convert[i - 1];
      }
    }

    convert[convert.length - 1].next = convert[0];
    convert[0].previous = convert[convert.length - 1];

    this.vertices = Object.seal(convert);
    this.clockwise = (clockwise != null ?
      clockwise : getPolygonArea(this.vertices));
  }

  /**
   * Retrieves a proxy for the edges.
   *
   * @type {ArrayProxy<Edge>}
   * @readonly
   * @memberof SimplePolygon
   */
  get edges() {
    const self = this;

    return {
      * [Symbol.iterator]() {
        for (let i = 0; i < self.vertices.length; i++) {
          yield this.get(i);
        }
      },
      get(index) {
        const start = self.vertices[index];
        return {
          start,
          end: start.next,
          get normal() {
            const dir = start.next.clone().subtract(start).normalized();
            return self.clockwise ?
              new Vector2D(-dir.y, dir.x) : new Vector2D(dir.y, -dir.x);
          },
        };
      },
      length: self.vertices.length,
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
