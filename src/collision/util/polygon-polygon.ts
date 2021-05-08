import Vector2D from 'math/vector2d';
import polygonLine from './polygon-line';

export default function polygonPolygon(
  verticesA: Vector2D[], verticesB: Vector2D[]
  ): boolean {
  for (let i = 0; i < verticesA.length; i++) {
    const next = (i + 1) % verticesA.length;
    if (polygonLine(verticesA[i], verticesA[next], verticesB)) {
      return true;
    }
  }

  return false;
}

