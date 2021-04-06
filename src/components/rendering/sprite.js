import Component from '../core/component.js.js';
import Vector2 from '../math/vector2.js.js';
import Transform2D from '../transform-2d.js.js';

class Sprite extends Component {
  static ATTRIBUTES = {
    REQUIRES: [Transform2D],
  };

  /**
   * Creates an instance of Sprite.
   * @param {CanvasImageSource} texture
   * @param {Vector2} [pivot]
   * 
   * @memberOf Sprite
   */
  constructor(texture, pivot=null) {
    super();
    this.texture = texture;

    this.pivot = new Vector2(
      pivot?.x || texture.width / 2,
      pivot?.y || texture.height / 2,
    );
  }

  toJSON() {
    
  }
}

export default Sprite;
