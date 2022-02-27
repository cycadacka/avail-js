import Vector2D from 'math/vector2d';

export interface ContactPoint {
  point: Vector2D;
  normal: Vector2D;
}

export interface CollisionInfo {
  contacts: ContactPoint[];
}

export type CollisionInfoUnion = CollisionInfo & {
  self: string;
  other: string;
};
