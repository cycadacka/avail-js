import Transform from '../src/components/transform.js';
import Scene from '../src/core/scene.js';
import Vector2D from '../src/math/vector2d.js';
import Rect from '../src/components/shapes/rect.js';
import ShapeRenderer from '../src/systems/rendering/shape-renderer.js';
import ShapeMaterial from '../src/components/rendering/shape-material.js';
import Ellipse from '../src/components/shapes/ellipse.js';

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const scene = new Scene([
  new ShapeRenderer(canvas),
  {
    update(time, entityManager) {
      const transform = entityManager.getComponent(
        entityManager.getEntityWithTag('a'),
        Transform,
      );
      transform.rotation += 20 * time.deltaTime;
    },
  },
]);

const entityA = scene.entityManager.createEntity('a');
scene.entityManager.addComponents(
  entityA,
  new Rect(1, 1),
  new Ellipse(1, 1),
  new ShapeMaterial({
    fillStyle: (() => {
      const grd = context.createLinearGradient(0, 0, 600, 0);
      grd.addColorStop(0, 'blue');
      grd.addColorStop(1, 'red');
      return grd;
    })(),
    strokeStyle: 'red',
  }),
  new Transform(
    new Vector2D(canvas.width/2, canvas.height/2),
    0,
    new Vector2D(canvas.width, 50),
  ),
);

// const entityB = scene.entityManager.createEntity();

scene.start();
