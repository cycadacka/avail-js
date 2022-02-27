const input = new AvailJS.InputSystem();

function createBox(x, y, width, height, layer, tag) {
  return scene.entityManager.createEntity(tag, [
    new AvailJS.Transform([x, y]),
    new AvailJS.shapes.Rect(width, height),
    new AvailJS.collision.PolygonCollider(0, 1, layer),
    new AvailJS.shapes.PolygonMaterial({
      fillStyle: 'transparent',
      strokeStyle: 'blue',
    }),
  ]);
}

function createLine(point, normal, color = 'black') {
  const line = scene.entityManager.createEntity('', [
    new AvailJS.Transform([point.x, point.y]),
    new AvailJS.shapes.Polygon([
      [0, 0],
      [0, 0],
      [normal.x, normal.y],
    ]),
    new AvailJS.shapes.PolygonMaterial({
      strokeStyle: color,
    }),
  ]);

  setTimeout(() => {
    scene.entityManager.destroyEntity(line);
  }, 2000);

  return line;
}

const polygonCollision = new AvailJS.collision.PolygonCollisionSystem(
  new AvailJS.collision.LayerCollisionMatrix(
    ['Player', 'PlayerAgainst'],
    [
      [1, 0], // PlayerAgainst
      [0], // Player
    ]
  )
);

const canvas = document.getElementsByTagName('canvas')[0];
const scene = new AvailJS.Scene([
  input,
  new AvailJS.physics.PhysicsSystem(polygonCollision),
  polygonCollision,
  new AvailJS.shapes.PolygonRenderer(canvas),
]);

const playerID = createBox(300, 150, 50, 50, 'Player', 'player');
scene.entityManager.addComponent(playerID, new AvailJS.physics.RigidBody());
console.log(`Player is ${playerID}`);

// Add sample of child following the parent.
const playerChild = scene.entityManager.getComponent(
  createBox(150, 50, 50, 50, 'Player', 'player-child'),
  AvailJS.Transform
);
playerChild.setParent(playerID);

// Add bounding boxes.
{
  const boxParent = scene.entityManager.getComponent(
    createBox(
      0,
      canvas.height / 2,
      25,
      canvas.height,
      'PlayerAgainst',
      'parent'
    ),
    AvailJS.Transform
  );

  boxParent.addChildren(
    true,
    createBox(
      0,
      canvas.height / 2,
      25,
      canvas.height,
      'PlayerAgainst',
      'parent'
    ),
    createBox(
      canvas.width,
      canvas.height / 2,
      25,
      canvas.height,
      'PlayerAgainst'
    )
  );

  createBox(canvas.width / 2, 0, canvas.width, 25, 'PlayerAgainst');
  createBox(canvas.width / 2, canvas.height, canvas.width, 25, 'PlayerAgainst');
}

{
  const ellipseID = scene.entityManager.createEntity('', [
    new AvailJS.Transform([canvas.width / 2, canvas.height / 2]),
    new AvailJS.shapes.Ellipse(25, 100),
    new AvailJS.collision.PolygonCollider(0, 0, 'PlayerAgainst'),
    new AvailJS.shapes.PolygonMaterial({
      fillStyle: 'transparent',
      strokeStyle: 'red',
    }),
  ]);

  // Visualize diagonals of ellipse polygon.
  const polygon = scene.entityManager.getComponent(
    ellipseID,
    AvailJS.shapes.ConvexPolygon
  );
  for (let i = 0; i < polygon.vertices.length; i++) {
    const matrix = scene.entityManager.getComponent(
      ellipseID,
      AvailJS.Transform
    ).localToWorldMatrix;
    createLine(
      matrix.multiplyVector2(polygon.centre),
      matrix
        .multiplyVector2(polygon.vertices[i])
        .subtract(matrix.multiplyVector2(polygon.centre))
    );
  }
}

scene.start();
