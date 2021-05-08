import { Vertex } from '../polygon';

/**
 * Sorts the vertices, increasingly, by their y-coordinate.
 */
export default function ySortVertices(vertices: Vertex[]): Vertex[] {
  return vertices.sort((a, b) => a.y - b.y);
}
