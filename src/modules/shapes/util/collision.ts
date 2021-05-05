import { PointLike, BoundingBox } from 'types';
import Vector2D from 'math/vector2d';
import Transform from 'modules/transform';

/**
 * @param minA Top-left of the first rectangle.
 * @param maxA Bottom-right of the second rectangle.
 * @param minB Top-left of the second rectangle.
 * @param maxB Bottom-right of the second rectangle.
 */
export function rectangleRectangleCollision(
  minA: PointLike, maxA: PointLike, minB: PointLike, maxB: PointLike
  ): boolean {
  return (
    minA.x < maxB.x &&
    minA.y < maxB.y &&
    maxA.x > minB.x &&
    maxA.y > minB.y
  );
}

export function circleCircleCollision(
  originA: Vector2D, radiusA: number, originB: Vector2D, radiusB: number
  ): boolean {
  return originA.clone().subtract(originB).sqrMagnitude() <= radiusA + radiusB;
}

export function linePointCollision(
  start: Vector2D, end: Vector2D, point: Vector2D
  ): boolean {
  return Math.abs(
    start.clone().subtract(end).sqrMagnitude() -
    (point.clone().subtract(start).sqrMagnitude() +
    point.clone().subtract(end).sqrMagnitude()),
  ) <= 0.1;
}

export function lineLineCollision(
  startA: Vector2D, endA: Vector2D, startB: Vector2D, endB: Vector2D
  ): boolean {
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

  return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
}

export function polygonPointCollision(
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

export function polygonLineCollision(
  start: Vector2D, end: Vector2D, vertices: Vector2D[]
  ): boolean {
  for (let i = 0; i < vertices.length; i++) {
    const next = (i + 1) % vertices.length;
    if (lineLineCollision(vertices[i], vertices[next], start, end)) {
      return true;
    }
  }

  return false;
}

export function polygonPolygonCollision(
  verticesA: Vector2D[], verticesB: Vector2D[]
  ): boolean {
  for (let i = 0; i < verticesA.length; i++) {
    const next = (i + 1) % verticesA.length;
    if (polygonLineCollision(verticesA[i], verticesA[next], verticesB)) {
      return true;
    }
  }

  return false;
}

/**
 * Retrieves the axis-aligned bounding box for an object-aligned bounding box.
 */
 export function obb2aabb(obb: BoundingBox, transform: Transform): BoundingBox {
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

