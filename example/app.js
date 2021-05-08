"strict mode";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    var script;
    script = document.createElement("script");
    script.async = true;
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;

    document.body.appendChild(script);
  });
}

loadScript("../dist/avail-js.js")
  .then(() => {
    const polygonCollisionSystem = new AvailJS.collision.PolygonCollision();

    class Velocity extends AvailJS.Component {
      constructor(xMin, xMax, yMin, yMax) {
        super();
        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;

        this.x =
          (xMin + (xMax - xMin) * Math.random()) *
          (Math.random() < 0.5 ? -1 : 1);
        this.y =
          (yMin + (yMax - yMin) * Math.random()) *
          (Math.random() < 0.5 ? 1 : -1);
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

        const transform = entityManager.getComponent(
          playerID,
          AvailJS.Transform
        );
        const velocity = entityManager.getComponent(playerID, Velocity);

        const collisionInfo = polygonCollisionSystem
          .getCollisions(playerID)
          .next().value;
        if (collisionInfo !== 0) {
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

    window.scene = (function () {
      const canvas = document.getElementsByTagName("canvas")[0];
      window.polygonRenderer = new AvailJS.shapes.PolygonRenderer(canvas);

      const scene = new AvailJS.Scene(
        [
          new VelocitySystem(),
          new AvailJS.shapes.PolygonRenderer(canvas),
          polygonCollisionSystem,
        ],
        1 / 50,
        60
      );

      function createBox(x, y, width, height, tag = "") {
        return scene.entityManager.createEntity(tag, [
          new AvailJS.Transform([x, y]),
          new AvailJS.shapes.Rect(width, height),
          new AvailJS.collision.PolygonCollider(0, 0),
          new AvailJS.shapes.PolygonMaterial({
            fillStyle: "red",
            strokeStyle: "blue",
          }),
        ]);
      }

      const player = createBox(150, 175, 50, 50, "player");
      scene.entityManager.addComponent(player, new Velocity(20, 27, 20, 27));

      createBox(0, canvas.height / 2, 25, canvas.height, "left-box");
      createBox(
        canvas.width,
        canvas.height / 2,
        25,
        canvas.height,
        "right-box"
      );
      createBox(canvas.width / 2, 0, canvas.width, 25, "up-box");
      createBox(canvas.width / 2, canvas.height, canvas.width, 25, "down-box");

      return scene;
    })();

    scene.start();
  })
  .catch((reason) => {
    throw reason;
  });
