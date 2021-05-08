import Vector2D from 'math/vector2d';

export default function circleCircle(
  originA: Vector2D, radiusA: number, originB: Vector2D, radiusB: number
  ): boolean {
  return originA.clone().subtract(originB).sqrMagnitude() <= radiusA + radiusB;
}
