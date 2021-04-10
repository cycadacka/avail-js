import Component from '../core/component.js.js';
import Vector2D from '../math/vector2d.js';
import Transform2D from '../transform-2d.js.js';

/**
 * Texture of an entity with pivot.
 *
 * @class Sprite
 * @extends {Component}
 */
class Sprite extends Component {
  /**
   * Creates an instance of Sprite.
   *
   * @param {CanvasImageSource} texture
   * @param {Vector2D} [pivot]
   * @memberOf Sprite
   */
  constructor(texture, pivot=null) {
    super();
    this.texture = texture;

    this.pivot = new Vector2D(
      pivot?.x || texture.width / 2,
      pivot?.y || texture.height / 2,
    );
  }
}

Sprite.ATTRIBUTES = Object.freeze({
  REQUIRES: [Transform2D],
});

export default Sprite;
