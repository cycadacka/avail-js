import Component from '../../core/component.js';
import Transform from '../transform.js';

/**
 * Represents an ellipse.
 *
 * @class Ellipse
 * @extends {Component}
 */
class Ellipse extends Component {
  /**
   * Creates an instance of Ellipse.
   *
   * @param {number} radiusX
   * @param {number} radiusY
   * @memberof Circle
   */
  constructor(radiusX, radiusY) {
    super();

    this.radiusX = radiusX;
    this.radiusY = radiusY;
  }
}

Ellipse.ATTRIBUTES.REQUIRES = [Transform];

export default Ellipse;
