import Vector2D from 'math/vector2d';
import { BoundingBox } from 'types';
import Transform from 'modules/transform';

/**
 * Retrieves the axis-aligned bounding box for an object-aligned bounding box.
 *
 */
export function getAABB(obb: BoundingBox, transform: Transform): BoundingBox {
  // Construct a box from object-aligned bounding-box
  const box = [
    obb.min,
    new Vector2D(obb.min.x, obb.max.y),
    obb.max,
    new Vector2D(obb.max.x, obb.min.y),
  ];

  // Transform the constructed box
  const matrix = transform.localToWorldMatrix;
  const min = new Vector2D(Infinity, Infinity);
  const max = new Vector2D(-Infinity, -Infinity);

  for (let i = 0; i < 4; i++) {
    const vertex = matrix.multiplyVector2(box[i]);

    if (vertex.x < min.x) {
      min.x = vertex.x;
    }

    if (vertex.x > max.x) {
      max.x = vertex.x;
    }

    if (vertex.y < min.y) {
      min.y = vertex.y;
    }

    if (vertex.y > max.y) {
      max.y = vertex.y;
    }
  }

  // Construct an axis-aligned bounding-box from the transformed box.
  return {
    min: new Vector2D(
      obb.min.x < obb.max.x ? obb.min.x : obb.max.x,
      obb.min.y < obb.max.y ? obb.min.y : obb.max.y,
    ),
    max: new Vector2D(
      obb.max.x > obb.min.x ? obb.max.x : obb.min.x,
      obb.max.y > obb.min.y ? obb.max.y : obb.min.y,
    ),
  };
}
