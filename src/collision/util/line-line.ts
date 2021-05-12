import Vector2D from "math/vector2d";
import { CollisionInfo } from '../types';

export default function lineLine(
  startA: Vector2D,
  endA: Vector2D,
  startB: Vector2D,
  endB: Vector2D,
): CollisionInfo {
  const uA =
    ((endB.x - startB.x) * (startA.y - startB.y) -
      (endB.y - startB.y) * (startA.x - startB.x)) /
    ((endB.y - startB.y) * (endA.x - startA.x) -
      (endB.x - startB.x) * (endA.y - startA.y));

  const uB =
    ((endA.x - startA.x) * (startA.y - startB.y) -
      (endA.y - startA.y) * (startA.x - startB.x)) /
    ((endB.y - startB.y) * (endA.x - startA.x) -
      (endB.x - startB.x) * (endA.y - startA.y));

  const normal = endA.clone().subtract(startA).normalized;
  return {
    contacts: uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1 ? [
      {
        point: new Vector2D(
          startA.x + (uA * (endA.x - startA.x)),
          startA.y + (uA * (endA.y - startA.y))
        ),
        normal: new Vector2D(-normal.y, normal.x),
      }
    ] : [],
  };
}
