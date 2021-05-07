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
    const scene = (function () {
      const canvas = document.getElementsByTagName("canvas")[0];

      const scene = new AvailJS.Scene([
        new AvailJS.modules.shapes.PolygonRenderer(canvas),
        new AvailJS.modules.shapes.PolygonCollision(),
      ]);

      scene.entityManager.createEntity("", [
        new AvailJS.modules.Transform([0, 0]),
        new AvailJS.modules.shapes.Rect(50, 50),
        new AvailJS.modules.shapes.PolygonMaterial({
          fillStyle: "red",
          strokeStyle: "blue",
        }),
      ]);

      return scene;
    })();

    window.scene = scene;
  })
  .catch((reason) => {
    throw reason;
  });
