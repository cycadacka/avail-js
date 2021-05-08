import Component from 'core/component';
import Vector2D from 'math/vector2d';
import Transform2D from 'common/transform';

/**
 * Texture of an entity with pivot.
 *
 * @class Sprite
 * @extends {Component}
 */
class Sprite extends Component {
  public texture: CanvasImageSource;
  public pivot: Vector2D;

  /**
   * Creates an instance of Sprite.
   *
   * @memberof Sprite
   */
  constructor(texture: CanvasImageSource, pivot: Vector2D = new Vector2D(texture.width as number / 2, texture.height as number / 2)) {
    super();
  
    this.texture = texture;
    this.pivot = pivot;
  }

  get attributes() {
    return {
      single: false,
      requires: [Transform2D],
    }
  }
}

export default Sprite;
