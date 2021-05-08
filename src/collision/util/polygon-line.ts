import lineLine from './line-line';
import Vector2D from 'math/vector2d';
import { CollisionInfo } from '../types';

export default function polygonLine(
  start: Vector2D, end: Vector2D, vertices: Vector2D[]
  ): CollisionInfo {
  for (let i = 0; i < vertices.length; i++) {
    const next = (i + 1) % vertices.length;

    const collisionInfo = lineLine(vertices[i], vertices[next], start, end);
    if (collisionInfo.contacts.length > 0) {
      return collisionInfo;
    }
  }

  return {
    contacts: [],
  };
}

