import Vector2D from '../../math/vector2d';
import SimplePolygon from './simple-polygon';
import { BoundingBox } from '../../types';

/**
 * Converts a rectangle into a polygon (vertices).
 *
 * @ignore
 */
function rectToPolygon(width: number, height: number): [number, number][] {
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
  private _width: number;
  private _height: number;

  /**
   * Creates an instance of Rect.
   *
   * @memberof Rect
   */
  constructor(width: number, height: number) {
    super(rectToPolygon(width, height), true);

    this._width = width;
    this._height = height;
  }

  get width() {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
    this.updateVertices();
  }

  get height() {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
    this.updateVertices();
  }

  /**
   * @override
   * @memberof Rect
   */
  get obb(): BoundingBox {
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
  private updateVertices() {
    const updatedVertices = rectToPolygon(this._width, this._height);
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].x = updatedVertices[i][0];
      this.vertices[i].y = updatedVertices[i][1];
    }
  }
}

export default Rect;
