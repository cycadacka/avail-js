import { CollisionInfo, ContactPoint } from '../types';
import Vector2D from 'math/vector2d';
import lineLine from './line-line';

/**
 * Convex to convex polygon collision by comparing one's diagonals (from centre)
 * and the edges of the another polygon.
 *
 * @param c1 Center of the first polygon.
 * @param v1 Vertices of the first polygon.
 * @param v2 Vertices of the second polygon.
 * @returns
 */
export default function convexPolygonConvexPolygon(
  c1: Vector2D,
  v1: Vector2D[],
  v2: Vector2D[]
): CollisionInfo {
  const contacts: ContactPoint[] = [];

  for (let i = 0; i < v1.length; i++) {
    for (let j = 0; j < v2.length; j++) {
      const info = lineLine(c1, v1[i], v2[j], v2[(j + 1) % v2.length]);

      if (info.contacts.length > 0) {
        contacts.push(info.contacts[0]);
      }
    }
  }

  return { contacts };
}
