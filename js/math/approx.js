
/**
 * @param {number} a
 * @param {number} b
 * @param {number} tolerance
 */
export default function approx(a, b, tolerance = 0.001953125) {
  return Math.abs(a - b) < tolerance;
}
