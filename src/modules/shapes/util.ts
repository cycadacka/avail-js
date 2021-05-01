import { Vertex } from './polygon';

/**
 * Sorts the vertices, increasingly, by their y-coordinate.
 */
function sort(vertices: Vertex[]): Vertex[] {
  return vertices.sort((a, b) => a.y - b.y);
}

/**
 * Partitions a non-monotone polygon into a bunch of y-monotone polygons.
 */
function partition(vertices: Vertex[]): Vertex[][] {
  const polygons = [sort(vertices)];

  // TODO: Partition to y-monotone

  return polygons;
}

/**
 * Partitions a polygon into a bunch of triangles.
 */
export function triangulate(vertices: Vertex[]): Vertex[][] {
  const polygons = partition(vertices);
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

type sign = 0 | 1 | -1;

export function area(vertices: [number, number][]): sign {
  let area = 0;

  let previous = vertices[vertices.length - 1];
  for (let i = 0; i < vertices.length; i++) {
    area += (previous[0] + vertices[i][0]) * (previous[1] + vertices[i][1]);
    previous = vertices[i];
  }

  return <sign>Math.sign(area);
}
