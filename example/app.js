"strict mode";

const main_collisionMatrix = new AvailJS.collision.CollisionMatrix(
  ["Player", "Box"],
  [
    // Box Player
    [true, false],
    [false],
  ]
);
const main_polygonCollision = new AvailJS.collision.PolygonCollision(
  main_collisionMatrix
);

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

class VelocitySystem {
  start({ entityManager }) {
    entityManager.getComponent(
      entityManager.getEntityWithTag("player"),
      AvailJS.Transform
    ).rotation = Math.random() * 360;
  }
  fixedUpdate({ entityManager, time }) {
    const playerID = entityManager.getEntityWithTag("player");

    const transform = entityManager.getComponent(playerID, AvailJS.Transform);
    const velocity = entityManager.getComponent(playerID, Velocity);

    const collisionInfo = main_polygonCollision.getCollisions(playerID).next()
      .value;
    if (collisionInfo !== 0) {
      console.log(
        `Collide with ${entityManager.getTagOfEntity(collisionInfo.other)}`
      );
      velocity.x =
        (velocity.xMin + (velocity.xMax - velocity.xMin) * Math.random()) *
        Math.sign(velocity.x);
      velocity.y =
        (velocity.yMin + (velocity.yMax - velocity.yMin) * Math.random()) *
        Math.sign(velocity.y);

      const otherTag = entityManager.getTagOfEntity(collisionInfo.other);
      if (otherTag === "left-box" || otherTag === "right-box") {
        velocity.x = -velocity.x;
      }

      if (otherTag === "down-box" || otherTag === "up-box") {
        velocity.y = -velocity.y;
      }
    }

    transform.position.x += velocity.x * time.fixedDeltaTime;
    transform.position.y += velocity.y * time.fixedDeltaTime;
  }
}

const canvas = document.getElementsByTagName("canvas")[0];
const scene = new AvailJS.Scene(
  [
    new VelocitySystem(),
    new AvailJS.shapes.PolygonRenderer(canvas),
    main_polygonCollision,
  ],
  1 / 50,
  60
);

const player = createBox(150, 175, 50, 50, "player", "Player");
scene.entityManager.addComponent(player, new Velocity(20, 27, 20, 27));

createBox(0, canvas.height / 2, 25, canvas.height, "left-box");
createBox(canvas.width, canvas.height / 2, 25, canvas.height, "right-box");
createBox(canvas.width / 2, 0, canvas.width, 25, "up-box");
createBox(canvas.width / 2, canvas.height, canvas.width, 25, "down-box");

scene.start();

function createBox(x, y, width, height, tag, layer = "Box") {
  return scene.entityManager.createEntity(tag, [
    new AvailJS.Transform([x, y]),
    new AvailJS.shapes.Rect(width, height),
    new AvailJS.collision.PolygonCollider(
      0,
      0,
      main_collisionMatrix.getLayer(layer)
    ),
    new AvailJS.shapes.PolygonMaterial({
      fillStyle: "red",
      strokeStyle: "blue",
    }),
  ]);
}
