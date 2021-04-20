import Vector2D from '../../../math/vector2d.js';

/**
 * Represents a vertex.
 *
 * @class Vertex
 * @extends {Vector2D}
 */
export class Vertex extends Vector2D {
  /**
   * Creates an instance of Vertex.
   *
   * @param {number} x
   * @param {number} y
   * @memberof Vertex
   */
  constructor(x, y) {
    super(x, y);

    /**
     * Previous vertex of the current vertex.
     *
     * @type {Vertex}
     */
    this.previous = null;

    /**
     * Next vertex of the current vertex.
     *
     * @type {Vertex}
     */
    this.next = null;
  }
}
