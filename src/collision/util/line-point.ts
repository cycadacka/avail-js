import Vector2D from 'math/vector2d';

export default function linePoint(
  start: Vector2D, end: Vector2D, point: Vector2D
  ): boolean {
  return Math.abs(
    start.clone().subtract(end).sqrMagnitude -
    (point.clone().subtract(start).sqrMagnitude +
    point.clone().subtract(end).sqrMagnitude),
  ) <= 0.1;
}

