class Velocity extends AvailJS.Component {
  constructor(x = 0, y = 0) {
    super();

    this.x = x;
    this.y = y;
    this.state = 'active';
  }
}

const input = new AvailJS.Input();

class VelocitySystem {
  fixedUpdate({ entityManager, time }) {
    const playerID = entityManager.getEntityWithTag('player');

    const transform = entityManager.getComponent(playerID, AvailJS.Transform);
    const velocity = entityManager.getComponent(playerID, Velocity);

    if (velocity.state === 'active') {
      velocity.x +=
        (input.getKeyPress('KeyD') - input.getKeyPress('KeyA')) *
        50 *
        time.fixedDeltaTime;
      transform.rotation +=
        (input.getKeyPress('KeyQ') - input.getKeyPress('KeyE')) *
        25 *
        time.fixedDeltaTime;

      velocity.y += 9.81 * 25 * time.fixedDeltaTime;

      transform.position.x += velocity.x * time.fixedDeltaTime;
      transform.position.y += velocity.y * time.fixedDeltaTime;
    }
  }
}

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

const polygonCollision = new AvailJS.collision.PolygonCollision(
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
  new VelocitySystem(),
  polygonCollision,
  new AvailJS.shapes.PolygonRenderer(canvas),
]);

const playerID = createBox(150, 175, 50, 50, 'Player', 'player');
scene.entityManager.addComponent(playerID, new Velocity(0));

createBox(0, canvas.height / 2, 25, canvas.height, 'PlayerAgainst');
createBox(canvas.width, canvas.height / 2, 25, canvas.height, 'PlayerAgainst');
createBox(canvas.width / 2, 0, canvas.width, 25, 'PlayerAgainst');
createBox(canvas.width / 2, canvas.height, canvas.width, 25, 'PlayerAgainst');

const ellipseID = scene.entityManager.createEntity('', [
  new AvailJS.Transform([canvas.width / 2, canvas.height / 2]),
  new AvailJS.shapes.Ellipse(25, 100),
  new AvailJS.collision.PolygonCollider(0, 0, 'PlayerAgainst'),
  new AvailJS.shapes.PolygonMaterial({
    fillStyle: 'transparent',
    strokeStyle: 'red',
  }),
]);

{
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

let stayCollision = 0;
polygonCollision.subscribe('enter', playerID, (collisionInfo) => {
  stayCollision = 0;

  const transform = scene.entityManager.getComponent(
    playerID,
    AvailJS.Transform
  );
  const velocity = scene.entityManager.getComponent(playerID, Velocity);
  const polygonCollider = scene.entityManager.getComponent(
    playerID,
    AvailJS.collision.PolygonCollider
  );

  const normal = AvailJS.math.Vector2D.zero;
  for (let i = 0; i < collisionInfo.contacts.length; i++) {
    const contact = collisionInfo.contacts[i];

    transform.position.add(contact.normal.clone().multiply(1.25));
    createLine(contact.point, contact.normal, 'red');

    normal.add(contact.normal.normalized);
  }

  const mag = new AvailJS.math.Vector2D(velocity.x, velocity.y).magnitude;
  normal
    .divide(collisionInfo.contacts.length)
    .multiply(mag * polygonCollider.bounciness);

  velocity.x = normal.x * 0.75;
  velocity.y = normal.y * 0.75;
});

polygonCollision.subscribe('stay', playerID, (collisionInfo) => {
  stayCollision++;

  if (stayCollision > 2) {
    const velocity = scene.entityManager.getComponent(playerID, Velocity);
    const transform = scene.entityManager.getComponent(
      playerID,
      AvailJS.Transform
    );

    for (let i = 0; i < collisionInfo.contacts.length; i++) {
      const contact = collisionInfo.contacts[i];

      transform.position.add(contact.normal);
      createLine(contact.point, contact.normal, 'black');
    }

    velocity.state = 'static';
    stayCollision = 0;
  }
});

scene.start();
