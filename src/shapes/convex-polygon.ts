import Polygon from './polygon';

class ConvexPolygon extends Polygon {
  constructor(vertices: [number, number][], clockwise: boolean = false) {
    super(vertices, clockwise);
  }
}

export default ConvexPolygon;
