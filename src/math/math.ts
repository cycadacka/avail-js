
/**
 * Constant that converts from degrees to radians.
 */
export const DEG_TO_RAD: number = Math.PI / 180;

/**
 * Constant that converts from radians to degrees.
 */
export const RAD_TO_DEG: number = 180 / Math.PI;

/**
 * Clamps `n` between `min` and `max` (inclusive).
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.max(Math.min(n, max), min);
}

/**
 * Wraps `n` between `min` (inclusive) and `max` (exclusive).
 */
export function wrap(n: number, min: number, max: number): number {
  if (n < min) {
    return max - (min - n) % (max - min);
  } else {
    return min + (n - min) % (max - min);
  }
}

/**
 * Returns true if `a` and `b` are approximately the same number.
 */
export default function approx(a: number, b: number, tolerance: number = 0.001953125): boolean {
  return Math.abs(a - b) < tolerance;
}
