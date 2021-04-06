
import Vector2 from '../../../math/vector2.js';
/**
 * @package
 * @param {Vector2} minA Top-left of the first rectangle.
 * @param {Vector2} maxA Bottom-right of the second rectangle.
 * @param {Vector2} minB Top-left of the second rectangle.
 * @param {Vector2} maxB Bottom-right of the second rectangle.
 */
function rectangleRectangleCollision(minA, maxA, minB, maxB) {
  return minA.x < maxB.x &&
  minA.y < maxB.y &&
  maxA.x > minB.x &&
  maxA.y > minB.y;
}

/**
 * @package
 * @param {Vector2} originA
 * @param {number} radiusA
 * @param {Vector2} originB
 * @param {number} radiusB
 */
function circleCircleCollision(originA, radiusA, originB, radiusB) {
  return originA.clone().subtract(originB).sqrMagnitude() <= radiusA + radiusB;
}

/**
 * @package
 * @param {Vector2} start 
 * @param {Vector2} end 
 * @param {Vector2} point 
 */
function linePointCollision(start, end, point) {
  return Math.abs(start.clone().subtract(end).sqrMagnitude() -
  (point.clone().subtract(start).sqrMagnitude() + point.clone().subtract(end).sqrMagnitude())) <= 0.1;
}

/**
 * @package
 * @param {Vector2} startA
 * @param {Vector2} endA
 * @param {Vector2} startB
 * @param {Vector2} endB
 */
function lineLineCollision(startA, endA, startB, endB) {
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

/**
 * @package
 * @param {Vector2} point 
 * @param {Vector2[]} vertices 
 */
function polygonPointCollision(point, vertices) {
  let collision = false;

  for (let ci = 0; ci < vertices.length; ci++) {
    const ni = ci + 1;
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

/**
 * @package
 * @param {Vector2[]} vertices
 * @param {Vector2} start
 * @param {Vector2} end
 */
function polygonLineCollision(start, end, vertices) {
  for (let i = 0; i < vertices.length; i++) {
    const next = (i + 1) % vertices.length;
    if (lineLineCollision(vertices[i], vertices[next], start, end))
      return true;
  }

  return false;
}

/**
 * @package
 * @param {Vector2[]} verticesA
 * @param {Vector2[]} verticesB
 */
function polygonPolygonCollision(verticesA, verticesB) {
  for (let i = 0; i < verticesA.length; i++) {
    const next = (i + 1) % verticesA.length;
    if (polygonLineCollision(verticesA[i], verticesA[next], verticesB))
      return true;
  }

  return false;
}

export {
  rectangleRectangleCollision,
  circleCircleCollision,
  linePointCollision,
  lineLineCollision,
  polygonPointCollision,
  polygonLineCollision,
  polygonPolygonCollision,
}
