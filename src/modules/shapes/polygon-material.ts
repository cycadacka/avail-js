import Component from 'core/component';
import Polygon from './polygon';
import Transform from 'modules/transform';

interface MaterialConfig {
  lineWidth?: number;
  lineCap?: CanvasLineCap;
  lineJoin?: CanvasLineJoin;
  miterLimit?: number;
  lineDash?: number[];
  lineDashOffset?: number;
  fillStyle?: string|CanvasGradient|CanvasPattern;
  strokeStyle?: string|CanvasGradient|CanvasPattern;
}

/**
 * Represents how the shape should be rendered.
 *
 * @class PolygonMaterial
 * @extends {Component}
 */
class PolygonMaterial extends Component {
  public lineWidth: number | undefined;
  public lineCap: CanvasLineCap | undefined;
  public lineJoin: CanvasLineJoin | undefined;
  public miterLimit: number | undefined;
  public lineDash: number[] | undefined;
  public lineDashOffset: number | undefined;
  public fillStyle: string|CanvasGradient|CanvasPattern|undefined;
  public strokeStyle: string|CanvasGradient|CanvasPattern|undefined;

  /**
   * Creates an instance of PolygonMaterial.
   *
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
  }: MaterialConfig = {}) {
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
   * @memberof PolygonMaterial
   */
  setStyling(context: CanvasRenderingContext2D) {
    if (this.lineWidth) {
      context.lineWidth = this.lineWidth; // 1
    }

    if (this.lineCap) {
      context.lineCap = this.lineCap; // 'butt'
    }

    if (this.lineJoin) {
      context.lineJoin = this.lineJoin; // 'miter'
    }

    if (this.miterLimit) {
      context.miterLimit = this.miterLimit; // 10
    }

    if (this.lineDash) {
      context.setLineDash(this.lineDash); // []
    }

    if (this.lineDashOffset) {
      context.lineDashOffset = this.lineDashOffset; // 0
    }

    if (this.fillStyle) {
      context.fillStyle = this.fillStyle; // '#000'
    }

    if (this.strokeStyle) {
      context.strokeStyle = this.strokeStyle; // '#000'
    }
  }

  get attributes() {
    return {
      single: true,
      requires: [
        Transform,
        Polygon,
      ],
    };
  }
}

export default PolygonMaterial;
