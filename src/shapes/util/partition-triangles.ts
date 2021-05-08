import partitionMonotone from './partition-monotone.js';
import { Vertex } from '../polygon';

/**
 * Partitions a polygon into a bunch of triangles.
 */
export default function partitionTriangles(vertices: Vertex[]): Vertex[][] {
  const polygons = partitionMonotone(vertices);
  const triangles: [Vertex, Vertex, Vertex][] = [];

  for (let j = 0; j < polygons.length; j++) {
    const poly = polygons[j]; // Assumes `poly` is y-monotone

    const ymax = poly[polygons[j].length - 1];
    let chain1 = poly[0].next;
    let chain2 = poly[0].previous;

    while (chain1 !== ymax || chain2 !== ymax) {
      if (chain1.y > chain2.y) { // `chain1` is below `chain2`
        triangles.push([chain1, chain2, chain2.next]);
        chain2 = chain2.previous;
      } else if (chain2.y > chain1.y) { // `chain2` is below `chain1`
        triangles.push([chain1, chain2, chain1.previous]);
        chain1 = chain1.next;
      }
    }
  }

  return triangles;
}
