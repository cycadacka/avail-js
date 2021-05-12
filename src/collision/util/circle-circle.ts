import Vector2D from 'math/vector2d';
import { CollisionInfo } from '../types';

export default function circleCircle(originA: Vector2D, radiusA: number, originB: Vector2D, radiusB: number): CollisionInfo {
  const dir = originA.clone().subtract(originB);
  return {
    contacts: dir.sqrMagnitude <= radiusA + radiusB ? [
      {
        point: originB.clone().add(dir),
        normal: dir.normalized,
      }
    ] : [],
  };
}
