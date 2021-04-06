
/**
 * @param {number} n
 * @param {number} min
 * @param {number} max
 */
export default function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}
