import Transform from '../src/components/transform.js';
import Scene from '../src/core/scene.js';
import Vector2D from '../src/math/vector2d.js';
import Rect from '../src/components/shapes/rect.js';
import PolygonRenderer from '../src/systems/rendering/polygon-renderer.js';
import PolygonMaterial from '../src/components/rendering/polygon-material.js';
import Ellipse from '../src/components/shapes/ellipse.js';

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const scene = new Scene([
  new PolygonRenderer(canvas),
  {
    fixedUpdate(time, entityManager) {
      const transform = entityManager.getComponent(
        entityManager.getEntityWithTag('5fps'),
        Transform,
      );
      transform.rotation += 20 * time.deltaTime;
    },
  },
], 5, 60);

const entityA = scene.entityManager.createEntity('5fps');
scene.entityManager.addComponents(
  entityA,
  new Rect(1, 1),
  new Ellipse(1, 1),
  new PolygonMaterial({
    fillStyle: (() => {
      const grd = context.createLinearGradient(0, 0, 600, 0);
      grd.addColorStop(0, '#000');
      grd.addColorStop(1, '#fff');
      return grd;
    })(),
    strokeStyle: 'red',
  }),
  new Transform(
    new Vector2D(canvas.width/2, canvas.height/2),
    0,
    new Vector2D(canvas.width/2, 50),
  ),
);

// const entityB = scene.entityManager.createEntity();

scene.start();
