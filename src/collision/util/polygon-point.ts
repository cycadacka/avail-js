import Vector2D from 'math/vector2d';

export default function polygonPoint(
  point: Vector2D, vertices: Vector2D[]
  ): boolean {
  let collision = false;

  for (let ci = 0; ci < vertices.length; ci++) {
    let ni = ci + 1;
    if (ni == vertices.length) {
      ni = 0;
    }

    const cv = vertices[ci];
    const nv = vertices[ni];

    if ((
      (cv.y >= point.y && nv.y < point.y) ||
      (cv.y < point.y && nv.y >= point.y)) &&
      (point.x < (nv.x - cv.x) * (point.y - cv.y) / (nv.y - cv.y) + cv.x)) {
      collision = !collision;
    }
  }

  return collision;
}
