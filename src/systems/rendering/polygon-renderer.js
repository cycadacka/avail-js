import Transform from '../../components/transform.js';
import PolygonMaterial from '../../components/rendering/polygon-material.js';
import Polygon from '../../components/shapes/polygon.js';

/**
 * Handles rendering of `Polygon2dMaterial` unto a canvas element.
 *
 * @class PolygonRenderer2d
 */
class PolygonRenderer {
  /**
   * Creates an instance of SpriteRenderer.
   *
   * @param {HTMLCanvasElement} canvas
   * @memberof SpriteRenderer
   */
  constructor(canvas) {
    this._context = canvas.getContext('2d');
  }

  /**
   * Callback called every frame.
   *
   * @param {{deltaTime: number, time: number}} time
   * @param {import('../../core/package/entity-manager.js').default} manager
   * @memberof SpriteRenderer
   */
  update(time, manager) {
    this._context.clearRect(
      0,
      0,
      this._context.canvas.width,
      this._context.canvas.height,
    );

    const entities = manager.getEntitiesWithComponentType(PolygonMaterial);
    for (const entity of entities) {
      const material = manager.getComponent(entity, PolygonMaterial);
      const vertices = manager.getComponent(entity, Polygon).vertices;
      const matrix = manager.getComponent(
        entity,
        Transform,
      ).localToWorldMatrix;

      this._context.save();

      this._context.beginPath();

      const first = matrix.multiplyVector2(vertices.get(0));
      this._context.moveTo(first.x, first.y);

      for (let i = 0; i < vertices.length; i++) {
        const vertex = matrix.multiplyVector2(vertices.get(i));
        this._context.lineTo(vertex.x, vertex.y);
      }

      this._context.lineTo(first.x, first.y);

      material.setStyling(this._context);

      this._context.fill();
      this._context.stroke();

      this._context.closePath();

      this._context.restore();
    }
  }
}

export default PolygonRenderer;
