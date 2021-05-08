import Vector2D from 'math/vector2d';
import polygonLine from './polygon-line';
import { CollisionInfo } from '../types';

export default function polygonPolygon(
  verticesA: Vector2D[], verticesB: Vector2D[]
  ): CollisionInfo {
  for (let i = 0; i < verticesA.length; i++) {
    const next = (i + 1) % verticesA.length;

    const collisionInfo = polygonLine(verticesA[i], verticesA[next], verticesB);
    if (collisionInfo.contacts.length > 0) {
      return collisionInfo;
    }
  }

  return {
    contacts: [],
  };
}

