class Velocity extends AvailJS.Component {
  constructor(xMin, xMax, yMin, yMax) {
    super();
    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;

    this.x =
      (xMin + (xMax - xMin) * Math.random()) * (Math.random() < 0.5 ? -1 : 1);
    this.y =
      (yMin + (yMax - yMin) * Math.random()) * (Math.random() < 0.5 ? 1 : -1);
  }
}

const input = new AvailJS.Input();

class VelocitySystem {
  start({ entityManager }) {
    entityManager.getComponent(
      entityManager.getEntityWithTag('player'),
      AvailJS.Transform
    ).rotation = Math.random() * 360;
  }

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
      fillStyle: 'red',
      strokeStyle: 'blue',
    }),
  ]);
}

const polygonCollision = new AvailJS.collision.PolygonCollision(
  new AvailJS.collision.CollisionMatrix(
    ['player', 'box', 'ellipse'],
    [
      [true, false, false], // ellipse
      [true, false], // box
      [false], // player
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
  1 / 50,
  60
);

const playerID = createBox(150, 175, 50, 50, 'player', 'player');
scene.entityManager.addComponent(playerID, new Velocity(50, 100, 50, 100));

createBox(0, canvas.height / 2, 25, canvas.height, 'left-box');
createBox(canvas.width, canvas.height / 2, 25, canvas.height, 'right-box');
createBox(canvas.width / 2, 0, canvas.width, 25, 'up-box');
createBox(canvas.width / 2, canvas.height, canvas.width, 25, 'down-box');

scene.entityManager.createEntity('ellipse', [
  new AvailJS.Transform([canvas.width / 2, canvas.height / 2]),
  new AvailJS.shapes.Ellipse(25, 100),
  new AvailJS.collision.PolygonCollider(0, 0, 'ellipse'),
  new AvailJS.shapes.PolygonMaterial({
    fillStyle: 'blue',
    strokeStyle: 'red',
  }),
]);

polygonCollision.subscribe('enter', playerID, (collisionInfo) => {
  const velocity = scene.entityManager.getComponent(playerID, Velocity);

  const otherTag = scene.entityManager.getTagOfEntity(collisionInfo.other);
  if (otherTag === 'left-box' || otherTag === 'right-box') {
    velocity.x =
      (velocity.xMin + (velocity.xMax - velocity.xMin) * Math.random()) *
      Math.sign(velocity.x);
    velocity.y =
      (velocity.yMin + (velocity.yMax - velocity.yMin) * Math.random()) *
      Math.sign(velocity.y);

    velocity.x = -velocity.x;
  }

  if (otherTag === 'down-box' || otherTag === 'up-box') {
    velocity.x =
      (velocity.xMin + (velocity.xMax - velocity.xMin) * Math.random()) *
      Math.sign(velocity.x);
    velocity.y =
      (velocity.yMin + (velocity.yMax - velocity.yMin) * Math.random()) *
      Math.sign(velocity.y);

    velocity.y = -velocity.y;
  }
});

polygonCollision.subscribe('stay', playerID, (collisionInfo) => {
  const velocity = scene.entityManager.getComponent(playerID, Velocity);

  if (scene.entityManager.getTagOfEntity(collisionInfo.other) === 'ellipse') {
    const transform = scene.entityManager.getComponent(
      playerID,
      AvailJS.Transform
    );

    console.log(collisionInfo);
    const dir = collisionInfo.contacts[0].normal.multiply(25);
    velocity.x = dir.x;
    velocity.y = dir.y;
  }
});

scene.start();
