import Vector2D from '../../../math/vector2d.js';

/**
 * Retrieves the axis-aligned bounding box for an object-aligned bounding box.
 *
 * @export
 * @package
 * @param {{min: Vector2D, max: Vector2D}} obb
 * @return {{min: Vector2D, max: Vector2D}}
 */
export function getAABB(obb) {
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
