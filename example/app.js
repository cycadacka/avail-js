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
    class Velocity extends AvailJS.modules.CollisionListener {
      constructor(x, y) {
        super((info) => {
          if (info.time.time != this.lastTime) {
            this.lastTime = info.time.time;
            this.x = -this.x * 1.15;
            this.y = -this.y * 1.15;
          }
        });
        this.lastTime = 0;
        this.x = x;
        this.y = y;
      }
    }

    window.scene = (function () {
      const canvas = document.getElementsByTagName("canvas")[0];
      const scene = new AvailJS.Scene(
        [
          new AvailJS.modules.shapes.PolygonRenderer(canvas),
          new AvailJS.modules.shapes.PolygonCollision(),
          {
            fixedUpdate({ entityManager, time }) {
              const transform = entityManager.getComponent(
                entityManager.getEntityWithTag("box"),
                AvailJS.modules.Transform,
              );

              const velocity = entityManager.getComponent(
                entityManager.getEntityWithTag("box"),
                Velocity,
              );

              transform.position.x += velocity.x * time.deltaTime;
              transform.position.y += velocity.y * time.deltaTime;
            },
          },
        ],
        1 / 50,
        60,
      );

      function createBox(x, y, width, height, tag = "") {
        return scene.entityManager.createEntity(tag, [
          new AvailJS.modules.Transform([x, y]),
          new AvailJS.modules.shapes.Rect(width, height),
          new AvailJS.modules.shapes.PolygonCollider(0, 0),
          new AvailJS.modules.shapes.PolygonMaterial({
            fillStyle: "red",
            strokeStyle: "blue",
          }),
        ]);
      }

      const box = createBox(150, 150, 50, 50, "box");
      scene.entityManager.addComponent(box, new Velocity(25, 25));

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
