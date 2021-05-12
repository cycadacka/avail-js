import lineLine from './line-line';
import Vector2D from 'math/vector2d';
import { CollisionInfo } from '../types';

export default function polygonLine(
  start: Vector2D, end: Vector2D, vertices: Vector2D[]
  ): CollisionInfo {
  const finalInfo: CollisionInfo = {
    contacts: []
  };

  for (let i = 0; i < vertices.length; i++) {
    const next = (i + 1) % vertices.length;

    const info = lineLine(vertices[i], vertices[next], start, end);
    finalInfo.contacts = finalInfo.contacts.concat(info.contacts);
  }

  return finalInfo;
}

