import Matrix3x3 from '../../../math/matrix3x3.js';
import Vector2D from '../../../math/vector2d.js';

export const AABB = {
  polygon(polygon) {
    const vertices = polygon.vertices;
    const min = new Vector2D();
    const max = new Vector2D();

    for (let i = 0; i < vertices.length; i++) {
      const vertex = vertices.get(i);

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
  },
  ellipse(radiusX, radiusY, rotation) {
    const matrix = Matrix3x3.createRotation(rotation);
    const min = matrix.multiplyVector2(new Vector2D(-radiusX, -radiusY));
    const max = matrix.multiplyVector2(new Vector2D(radiusX, radiusY));

    return {
      min: new Vector2D(
        min.x < max.x ? min.x : max.x,
        min.y < max.y ? min.y : max.y,
      ),
      max: new Vector2D(
        min.x > max.x ? min.x : max.x,
        min.y > max.y ? min.y : max.y,
      ),
    };
  },
};
