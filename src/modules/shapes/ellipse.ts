import Vector2D from 'math/vector2d';
import Polygon from './polygon';
import { BoundingBox } from './types';

/**
 * Converts an ellipse to a polygon.
 *
 * @ignore
 */
function ellipseToPolygon(x: number, y: number, resolution: number): [number, number][] {
  const vertices: [number, number][] = [];

  for (let i = 0; i <= resolution; i++) {
    const angle = i / resolution * 2.0 * Math.PI;
    vertices.push([x * Math.cos(angle), y * Math.sin(angle)]);
  }

  return vertices;
}

/**
 * Represents an ellipse.
 *
 * @class Ellipse
 * @extends {Polygon}
 */
class Ellipse extends Polygon {
  private _radius: Vector2D;

  /**
   * Creates an instance of Ellipse.
   *
   * @memberof Ellipse
   */
  constructor(x: number, y: number, resolution: number = 36) {
    super(ellipseToPolygon(x, y, resolution));

    this._radius = new Vector2D(x, y);
  }

  get radius() {
    return this._radius;
  }

  /**
   * @override
   * @memberof Ellipse
   */
  getOBB(): BoundingBox {
    return this.vertices.length > 36 ? {
      min: new Vector2D(-this._radius.x, -this._radius.y),
      max: new Vector2D(this._radius.x, this._radius.y),
    } : Polygon.prototype.getOBB.call(this);
  }

  /**
   * Update the ellipse in according the changed properties.
   *
   * @memberof Ellipse
   */
  update() {
    const updatedVertices = ellipseToPolygon(
      this._radius.x, this._radius.y, this.vertices.length,
    );
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].x = updatedVertices[i][0];
      this.vertices[i].y = updatedVertices[i][1];
    }
  }
}

export default Ellipse;
