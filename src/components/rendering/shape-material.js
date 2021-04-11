import Component from '../../core/component.js';
import Shape from '../shapes/package/shape.js';
import Transform from '../transform.js';

/**
 * Represents how the shape should be rendered.
 *
 * @class ShapeMaterial
 * @extends {Component}
 */
class ShapeMaterial extends Component {
  /**
   * Creates an instance of ShapeMaterial.
   *
   * @param {object} param
   * @param {number} [param.lineWidth=1]
   * @param {'butt'|'round'|'square'} [param.lineCap='butt']
   * @param {'miter'|'round'|'bevel'} [param.lineJoin='miter']
   * @param {number} [param.miterLimit=10]
   * @param {number[]} [param.lineDash=[]]
   * @param {number} [param.lineDashOffset=0]
   * @param {string|CanvasGradient|CanvasPattern} [param.fillStyle='#000']
   * @param {string|CanvasGradient|CanvasPattern} [param.strokeStyle='#000']
   * @memberof PolygonMaterial
   */
  constructor({
    lineWidth,
    lineCap,
    lineJoin,
    miterLimit,
    lineDash,
    lineDashOffset,
    fillStyle,
    strokeStyle,
  } = {}) {
    super();

    this.lineWidth = lineWidth;
    this.lineCap = lineCap;
    this.lineJoin = lineJoin;
    this.miterLimit = miterLimit;
    this.lineDash = lineDash;
    this.lineDashOffset = lineDashOffset;
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
  }

  /**
   * Set the styling of a canvas according to the material.
   *
   * @param {CanvasRenderingContext2D} context
   * @memberof PolygonMaterial
   */
  setStyling(context) {
    if (this.lineWidth) {
      context.lineWidth = this.lineWidth;
    }

    if (this.lineCap) {
      context.lineCap = this.lineCap;
    }

    if (this.lineJoin) {
      context.lineJoin = this.lineJoin;
    }

    if (this.miterLimit) {
      context.miterLimit = this.miterLimit;
    }

    if (this.lineDash) {
      context.setLineDash(this.lineDash);
    }

    if (this.lineDashOffset) {
      context.lineDashOffset = this.lineDashOffset;
    }

    if (this.fillStyle) {
      context.fillStyle = this.fillStyle;
    }

    if (this.strokeStyle) {
      context.strokeStyle = this.strokeStyle;
    }
  }
}

// TODO: Change from Polygon to Shape (maybe parent? abstract?)
ShapeMaterial.ATTRIBUTES = {
  SINGLE: true,
  REQUIRES: [
    Transform,
    Shape,
  ],
};

export default ShapeMaterial;
