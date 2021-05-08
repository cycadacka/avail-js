
type sign = 0 | 1 | -1;

export default function getPolygonArea(vertices: [number, number][]): sign {
  let area = 0;

  let previous = vertices[vertices.length - 1];
  for (let i = 0; i < vertices.length; i++) {
    area += (previous[0] + vertices[i][0]) * (previous[1] + vertices[i][1]);
    previous = vertices[i];
  }

  return <sign>Math.sign(area);
}
