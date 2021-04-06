import System from '../../core/system.js';
import Transform2D from '../../components/common/transform-2d.js';
import Sprite from '../../components/rendering/sprite.js';

/**
 * Handles rendering unto a canvas element.
 * @augments {System}
 */
class SpriteRenderer extends System {
  /** @type {CanvasRenderingContext2D} */
  #context;

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.#context = canvas.getContext('2d');
  }

  /**
   * @param {{time: number, deltaTime: number}} time 
   * @param {import('../entityManager.js').default} manager 
   */
  update(time, manager) {
    this.#context.clearRect(0, 0, this.#context.canvas.width, this.#context.canvas.height);

    const entities = manager.getEntitiesWithComponent(Sprite);
    for (const entity of entities) {
      /** @type {Sprite} */
      const sprite = manager.getComponent(entity, Sprite);
      /** @type {import('../common/matrix3x3.js').default} */
      const matrix = manager.getComponent(entity, Transform2D).localToWorldMatrix;

      this.#context.save();
    
      this.#context.setTransform(matrix.m00, matrix.m10, matrix.m01, matrix.m11, matrix.m02, matrix.m12);
      this.#context.drawImage(img, sprite.pivot.x, sprite.pivot.y);

      this.#context.restore();
    }
  }
}

export default SpriteRenderer;
