import Component from '../../../core/component.js';
import Transform from '../../transform.js';

/**
 * Base class for all shapes.
 *
 * @package
 * @class Shape
 * @extends {Component}
 */
class Shape extends Component {
}

Shape.ATTRIBUTES.SINGLE = true;
Shape.ATTRIBUTES.REQUIRES = [Transform];

export default Shape;
