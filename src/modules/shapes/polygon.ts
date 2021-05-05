import Component from 'core/component';
import Transform from 'modules/transform';
import Vector2D from 'math/vector2d';
import { ArrayProxy, BoundingBox } from 'types';
import { area } from './util/common';

export interface Vertex extends Vector2D {
  x: number;
  y: number;
  previous: Vertex;
  next: Vertex;
}

export interface Edge {
  start: Vertex;
  end: Vertex;
  readonly normal: Vector2D;
}

/**
 * Represents a simple polygon.
 *
 * @class Polygon
 */
class Polygon extends Component {
  public vertices: Vertex[];
  public readonly clockwise: boolean;

  /**
   * Creates an instance of Polygon.
   *
   * @memberof Polygon
   */
  constructor(vertices: [number, number][], clockwise: boolean = (area(vertices) > 0)) {
    super();

    if (vertices.length < 3) {
      throw new Error(
        'Polygon cannot be constructed with less than 3 vertices',
      );
    }

    const convert: Vertex[] = [];
    for (let i = 0; i < vertices.length; i++) {
      convert.push(<unknown>Object.assign(
        new Vector2D(vertices[i][0], vertices[i][1]),
        { next: null, previous: null },
      ) as Vertex);

      if (i > 0) {
        // set [i].previous && [i - 1].next
        convert[i - 1].next = convert[i];
        convert[i].previous = convert[i - 1];
      }
    }

    convert[convert.length - 1].next = convert[0];
    convert[0].previous = convert[convert.length - 1];

    this.vertices = Object.seal(convert);
    this.clockwise = clockwise;
  }

  get attributes() {
    return {
      single: true,
      requires: [
        Transform,
      ],
    }
  }

  /**
   * Retrieves a proxy for the edges.
   *
   * @memberof Polygon
   */
  get edges(): ArrayProxy<Edge> {
    const self = this;

    return {
      *[Symbol.iterator]() {
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
   * @memberof Polygon
   */
  get obb(): BoundingBox {
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

export default Polygon;
