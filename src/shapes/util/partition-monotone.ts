
import { Vertex } from '../polygon';
import ySortVertices from './y-sort-vertex-';

/**
 * Partitions a non-monotone polygon into a bunch of y-monotone polygons.
 */
export default function partitionMonotone(vertices: Vertex[]): Vertex[][] {
  const polygons = [ySortVertices(vertices)];

  return polygons;
}
