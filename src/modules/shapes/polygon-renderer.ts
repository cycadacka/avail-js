import Transform from 'modules/transform';
import PolygonMaterial from './polygon-material';
import Polygon from './polygon';
import System, { SceneInfo } from 'core/types';

/**
 * Handles rendering of `Polygon2dMaterial` unto a canvas element.
 *
 * @class PolygonRenderer
 */
class PolygonRenderer implements System {
  private context: CanvasRenderingContext2D;

  /**
   * Creates an instance of SpriteRenderer.
   *
   * @memberof PolygonRenderer
   */
  constructor(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d')!;
  }

  /**
   * @override
   * @memberof PolygonRenderer
   */
  update({entityManager}: SceneInfo) {
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height,
    );

    const entities = entityManager.getEntitiesWithComponent(PolygonMaterial);
    for (const entity of entities) {
      const polygonMaterial = entityManager.getComponent(entity, PolygonMaterial);
      const transform = entityManager.getComponent(entity, Transform);
      const polygons = entityManager.getComponents(entity, Polygon);

      if (!(polygonMaterial && transform) || polygons.length <= 0) {
        continue;
      }

      this.context.save();

      polygonMaterial.setStyling(this.context);

      const matrix = transform.localToWorldMatrix;
      for (let i = 0; i < polygons.length; i++) {
        const vertices = polygons[i].vertices;

        this.context.beginPath();

        const first = matrix.multiplyVector2(vertices[0]);
        this.context.moveTo(first.x, first.y);

        for (let i = 1; i < vertices.length; i++) {
          const vertex = matrix.multiplyVector2(vertices[i]);
          this.context.lineTo(vertex.x, vertex.y);
        }

        this.context.lineTo(first.x, first.y);

        this.context.fill();
        this.context.stroke();

        this.context.closePath();
      }

      this.context.restore();
    }
  }
}

export default PolygonRenderer;
