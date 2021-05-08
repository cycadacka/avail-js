import lineLine from './line-line';
import Vector2D from 'math/vector2d';

export default function polygonLine(
  start: Vector2D, end: Vector2D, vertices: Vector2D[]
  ): boolean {
  for (let i = 0; i < vertices.length; i++) {
    const next = (i + 1) % vertices.length;
    if (lineLine(vertices[i], vertices[next], start, end)) {
      return true;
    }
  }

  return false;
}

