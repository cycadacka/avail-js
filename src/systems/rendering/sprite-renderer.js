import Transform from '../../components/transform.js';
import Sprite from '../../components/rendering/sprite.js';

/**
 * Handles rendering of `Sprite` unto a canvas element.
 *
 * @class SpriteRenderer
 */
class SpriteRenderer {
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

    const entities = manager.getEntitiesWithComponent(Sprite);
    for (const entity of entities) {
      const sprite = manager.getComponent(entity, Sprite);
      const matrix = manager.getComponent(
        entity,
        Transform,
      ).localToWorldMatrix;

      this._context.save();

      this._context.setTransform(
        matrix.m00,
        matrix.m10,
        matrix.m01,
        matrix.m11,
        matrix.m02,
        matrix.m12,
      );
      this._context.drawImage(sprite.texture, sprite.pivot.x, sprite.pivot.y);

      this._context.restore();
    }
  }
}

export default SpriteRenderer;
