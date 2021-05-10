import Vector2D from 'math/vector2d';

export interface CollisionInfo {
  contacts: {
    point: Vector2D;
    normal: Vector2D;
  }[];
}
