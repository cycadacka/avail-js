
/**
 * Constant that converts from degrees to radians.
 *
 * @export
 * @type {number}
 */
export const DEG_TO_RAD = Math.PI / 180;

/**
 * Constant that converts from radians to degrees.
 *
 * @export
 * @type {number}
 */
export const RAD_TO_DEG = 180 / Math.PI;

/**
 * Clamps `n` between `min` and `max` (inclusive).
 *
 * @export
 * @param {number} n
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
export function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

/**
 * Wraps `n` between `min` (inclusive) and `max` (exclusive).
 *
 * @export
 * @param {number} n
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
export function wrap(n, min, max) {
  if (n < min) {
    return max - (min - n) % (max - min);
  } else {
    return min + (n - min) % (max - min);
  }
}

/**
 * Returns true if `a` and `b` are approximately the same number.
 *
 * @export
 * @param {number} a
 * @param {number} b
 * @param {number} [tolerance=0.001953125]
 * @return {number}
 */
export default function approx(a, b, tolerance = 0.001953125) {
  return Math.abs(a - b) < tolerance;
}
