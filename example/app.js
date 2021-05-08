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
      constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
      }
    }

    class VelocitySystem {
      fixedUpdate({ entityManager, time }) {
        const playerID = entityManager.getEntityWithTag("player");

        const transform = entityManager.getComponent(
          playerID,
          AvailJS.Transform,
        );
        const velocity = entityManager.getComponent(playerID, Velocity);

        const position = transform.position;

        if (polygonCollisionSystem.getCollisions(playerID).next().value !== 0) {
          velocity.x = -velocity.x * 2;
          velocity.y = -velocity.y * 2;
        }

        transform.position.x += velocity.x * time.fixedDeltaTime;
        transform.position.y += velocity.y * time.fixedDeltaTime;

        transform.position = position;
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
        60,
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
      scene.entityManager.addComponent(player, new Velocity(-25, -25));

      createBox(0, canvas.height / 2, 25, canvas.height);
      createBox(canvas.width, canvas.height / 2, 25, canvas.height);
      createBox(canvas.width / 2, 0, canvas.width, 25);
      createBox(canvas.width / 2, canvas.height, canvas.width, 25);

      return scene;
    })();

    scene.start();
  })
  .catch((reason) => {
    throw reason;
  });
