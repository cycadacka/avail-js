
/**
 * @param {number} x
 * @param {number} min
 * @param {number} max
 */
export default function wrap(x, min, max) {
  if (x < min)
    return max - (min - x) % (max - min);
  else
    return min + (x - min) % (max - min);
}
