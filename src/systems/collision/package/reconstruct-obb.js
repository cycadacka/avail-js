import Vector2D from '../../../math/vector2d.js';

/**
 * Retrieves the reconstructed OBB with proper minimum and maximum bounds.
 *
 * @package
 * @param {{min: Vector2D, max: Vector2D}} obb
 * @param {Transform} transform
 * @return {{min: Vector2D, max: Vector2D}}
 */
export function reconstructOBB(obb, transform) {
  // Reconstruct box
  const box = [
    obb.min,
    new Vector2D(obb.min.x, obb.max.y),
    obb.max,
    new Vector2D(obb.max.x, obb.min.y),
  ];

  // Transform reconstructed box
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

  return {min, max};
}
