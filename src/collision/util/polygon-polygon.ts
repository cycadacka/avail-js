import { CollisionInfo } from '../types';
import { Vertex } from 'shapes/types';
import polygonLine from './polygon-line';
import Vector2D from 'math/vector2d';
import lineLine from './line-line';

export default function polygonPolygon(
  verticesA: Vector2D[], verticesB: Vector2D[]
  ): CollisionInfo {
  const finalInfo: CollisionInfo = {
    contacts: [],
  };

  for (let k = 0; k < verticesA.length; k++) {
    const kNext = (k + 1) % verticesA.length;

    for (let j = 0; j < verticesB.length; j++) {
      const jNext = (j + 1) % verticesB.length;
      
      const info = lineLine(verticesA[k], verticesA[kNext], verticesB[k], verticesB[jNext]);
      finalInfo.contacts = finalInfo.contacts.concat(info.contacts);
    }
  }

  return finalInfo;
}

