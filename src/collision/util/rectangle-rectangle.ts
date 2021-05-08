import Vector2D from "math/vector2d";

/**
 * @param minA Top-left of the first rectangle.
 * @param maxA Bottom-right of the second rectangle.
 * @param minB Top-left of the second rectangle.
 * @param maxB Bottom-right of the second rectangle.
 */
export default function rectangleRectangle(
  minA: Vector2D,
  maxA: Vector2D,
  minB: Vector2D,
  maxB: Vector2D,
): boolean {
  return (
    minA.x < maxB.x && minA.y < maxB.y && maxA.x > minB.x && maxA.y > minB.y
  );
}
