
/**
 * @package
 * @param {import('../../../math/vector2d.js').default} minA Top-left of the
 * first rectangle.
 * @param {import('../../../math/vector2d.js').default} maxA Bottom-right of the
 * second rectangle.
 * @param {import('../../../math/vector2d.js').default} minB Top-left of the
 * second rectangle.
 * @param {import('../../../math/vector2d.js').default} maxB Bottom-right of the
 * second rectangle.
 * @return {boolean}
 */
function rectangleRectangleCollision(minA, maxA, minB, maxB) {
  return minA.x < maxB.x &&
  minA.y < maxB.y &&
  maxA.x > minB.x &&
  maxA.y > minB.y;
}

/**
 * @package
 * @param {import('../../../math/vector2d.js').default} originA
 * @param {number} radiusA
 * @param {import('../../../math/vector2d.js').default} originB
 * @param {number} radiusB
 * @return {boolean}
 */
function circleCircleCollision(originA, radiusA, originB, radiusB) {
  return originA.clone().subtract(originB).sqrMagnitude() <= radiusA + radiusB;
}

/**
 * @package
 * @param {import('../../../math/vector2d.js').default} start
 * @param {import('../../../math/vector2d.js').default} end
 * @param {import('../../../math/vector2d.js').default} point
 * @return {boolean}
 */
function linePointCollision(start, end, point) {
  return Math.abs(
    start.clone().subtract(end).sqrMagnitude() -
    (point.clone().subtract(start).sqrMagnitude() +
    point.clone().subtract(end).sqrMagnitude()),
  ) <= 0.1;
}

/**
 * @package
 * @param {import('../../../math/vector2d.js').default} startA
 * @param {import('../../../math/vector2d.js').default} endA
 * @param {import('../../../math/vector2d.js').default} startB
 * @param {import('../../../math/vector2d.js').default} endB
 * @return {boolean}
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
 * @param {import('../../../math/vector2d.js').default} point
 * @param {import('../../../math/vector2d.js').default[]} vertices
 * @return {boolean}
 */
function polygonPointCollision(point, vertices) {
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

/**
 * @package
 * @param {import('../../../math/vector2d.js').default[]} vertices
 * @param {import('../../../math/vector2d.js').default} start
 * @param {import('../../../math/vector2d.js').default} end
 * @return {boolean}
 */
function polygonLineCollision(start, end, vertices) {
  for (let i = 0; i < vertices.length; i++) {
    const next = (i + 1) % vertices.length;
    if (lineLineCollision(vertices[i], vertices[next], start, end)) {
      return true;
    }
  }

  return false;
}

/**
 * @package
 * @param {import('../../../math/vector2d.js').default[]} verticesA
 * @param {import('../../../math/vector2d.js').default[]} verticesB
 * @return {boolean}
 */
function polygonPolygonCollision(verticesA, verticesB) {
  for (let i = 0; i < verticesA.length; i++) {
    const next = (i + 1) % verticesA.length;
    if (polygonLineCollision(verticesA[i], verticesA[next], verticesB)) {
      return true;
    }
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
};
