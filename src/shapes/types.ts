import Vector2D from 'math/vector2d';

export interface Vertex extends Vector2D {
  x: number;
  y: number;
  previous: Vertex;
  next: Vertex;
}

export interface Edge {
  start: Vertex;
  end: Vertex;
  readonly normal: Vector2D;
}

export interface BoundingBox {
  max: Vector2D;
  min: Vector2D;
}
