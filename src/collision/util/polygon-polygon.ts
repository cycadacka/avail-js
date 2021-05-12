import { CollisionInfo } from '../types';
import lineLine from './line-line';
import Vector2D from 'math/vector2d';

export default function polygonPolygon(
  verticesA: Vector2D[],
  verticesB: Vector2D[]
): CollisionInfo {
  const finalInfo: CollisionInfo = {
    contacts: [],
  };

  for (let k = 0; k < verticesA.length; k++) {
    const cVertexA = verticesA[k];
    const nVertexA = verticesA[(k + 1) % verticesA.length];

    let pointInsideVerticesB = false;
    for (let j = 0; j < verticesB.length; j++) {
      const cVertexB = verticesB[j];
      const nVertexB = verticesB[(j + 1) % verticesB.length];

      if (
        cVertexB.y > cVertexA.y != nVertexB.y > cVertexA.y &&
        cVertexA.x <
          ((nVertexB.x - cVertexB.x) * (cVertexA.y - cVertexB.y)) /
            (nVertexB.y - cVertexB.y) +
            cVertexB.x
      ) {
        pointInsideVerticesB = !pointInsideVerticesB;
      }

      const info = lineLine(cVertexA, nVertexA, cVertexB, nVertexB);
      finalInfo.contacts = finalInfo.contacts.concat(info.contacts);
    }

    if (pointInsideVerticesB) {
      finalInfo.contacts = finalInfo.contacts.concat([
        {
          point: cVertexA,
          normal: Vector2D.zero,
        },
      ]);
    }
  }

  return finalInfo;
}
