import Transform from 'modules/transform';
import Sprite from './sprite';
import System, { SceneInfo } from 'core/system';

/**
 * Handles rendering of `Sprite` unto a canvas element.
 *
 * @class SpriteRenderer
 */
class SpriteRenderer implements System {
  private context: CanvasRenderingContext2D;

  /**
   * Creates an instance of SpriteRenderer.
   *
   * @memberof SpriteRenderer
   */
  constructor(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d')!;
  }

  /**
   * @override
   * @memberof SpriteRenderer
   */
  update({ entityManager }: SceneInfo) {
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height,
    );

    const entities = entityManager.getEntitiesWithComponent(Sprite);
    for (const entity of entities) {
      const sprite = entityManager.getComponent(entity, Sprite)!;
      const matrix = entityManager.getComponent(
        entity,
        Transform,
      )!.localToWorldMatrix;

      this.context.save();

      this.context.setTransform(
        matrix.m00,
        matrix.m10,
        matrix.m01,
        matrix.m11,
        matrix.m02,
        matrix.m12,
      );
      this.context.drawImage(sprite.texture, sprite.pivot.x, sprite.pivot.y);

      this.context.restore();
    }
  }
}

export default SpriteRenderer;
