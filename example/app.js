class Velocity extends AvailJS.Component {
  constructor(x = 0, y = 0) {
    super();

    this.x = x;
    this.y = y;
  }
}

const input = new AvailJS.Input();

class VelocitySystem {
  fixedUpdate({ entityManager, time }) {
    const playerID = entityManager.getEntityWithTag('player');

    const transform = entityManager.getComponent(playerID, AvailJS.Transform);
    const velocity = entityManager.getComponent(playerID, Velocity);

    const x = input.getKeyPress('KeyD') - input.getKeyPress('KeyA');
    const y = input.getKeyPress('KeyS') - input.getKeyPress('KeyW');
    if (y != 0 || x != 0) {
      velocity.x += 200 * x * time.fixedDeltaTime;
      velocity.y += 200 * y * time.fixedDeltaTime;
    }

    velocity.y += 9.8 * 50 * time.fixedDeltaTime;

    const r = input.getKeyPress('KeyQ') - input.getKeyPress('KeyE');
    if (r != 0) {
      transform.rotation += 100 * r * time.fixedDeltaTime;
    }

    transform.position.x += velocity.x * time.fixedDeltaTime;
    transform.position.y += velocity.y * time.fixedDeltaTime;
  }
}

function createBox(x, y, width, height, tag, layer = 'box') {
  return scene.entityManager.createEntity(tag, [
    new AvailJS.Transform([x, y]),
    new AvailJS.shapes.Rect(width, height),
    new AvailJS.collision.PolygonCollider(0, 0, layer),
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

const polygonCollision = new AvailJS.collision.PolygonCollision(
  new AvailJS.collision.CollisionMatrix(
    ['player', 'box', 'ellipse'],
    [
      [1, 0, 0], // ellipse
      [1, 0], // box
      [0], // player
    ]
  )
);

const canvas = document.getElementsByTagName('canvas')[0];
const scene = new AvailJS.Scene(
  [
    new VelocitySystem(),
    new AvailJS.shapes.PolygonRenderer(canvas),
    input,
    polygonCollision,
  ],
  1 / 60,
  60
);

const playerID = createBox(150, 175, 50, 50, 'player', 'player');
scene.entityManager.addComponent(playerID, new Velocity(0));

createBox(0, canvas.height / 2, 25, canvas.height, 'left-box');
createBox(canvas.width, canvas.height / 2, 25, canvas.height, 'right-box');
createBox(canvas.width / 2, 0, canvas.width, 25, 'up-box');
createBox(canvas.width / 2, canvas.height, canvas.width, 25, 'down-box');

const ellipseID = scene.entityManager.createEntity('ellipse', [
  new AvailJS.Transform([canvas.width / 2, canvas.height / 2]),
  new AvailJS.shapes.Ellipse(25, 100, 3),
  new AvailJS.collision.PolygonCollider(0, 0, 'ellipse'),
  new AvailJS.shapes.PolygonMaterial({
    fillStyle: 'transparent',
    strokeStyle: 'red',
  }),
]);

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

polygonCollision.subscribe('enter', playerID, (collisionInfo) => {
  const velocity = scene.entityManager.getComponent(playerID, Velocity);

  const normal = AvailJS.math.Vector2D.zero;
  for (let i = 0; i < collisionInfo.contacts.length; i++) {
    normal.add(collisionInfo.contacts[i].normal.normalized);
  }

  const mag = new AvailJS.math.Vector2D(velocity.x, velocity.y).magnitude;
  normal.divide(collisionInfo.contacts.length).multiply(mag);

  velocity.x += normal.x * 1.99;
  velocity.y += normal.y * 1.99;
});

polygonCollision.subscribe('stay', playerID, (collisionInfo) => {
  const transform = scene.entityManager.getComponent(
    playerID,
    AvailJS.Transform
  );

  for (let i = 0; i < collisionInfo.contacts.length; i++) {
    const contact = collisionInfo.contacts[i];
    createLine(contact.point, contact.normal);
    transform.position.add(contact.normal);
  }
});

scene.start();
