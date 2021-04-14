import Transform from '../src/components/transform.js';
import Scene from '../src/core/scene.js';
import Vector2D from '../src/math/vector2d.js';
import Rect from '../src/components/shapes/rect.js';
import Ellipse from '../src/components/shapes/ellipse.js';
import PolygonRenderer from '../src/systems/rendering/polygon-renderer.js';
import PolygonCollision from '../src/systems/collision/polygon-collision.js';
import PolygonMaterial from '../src/components/rendering/polygon-material.js';
import PolygonCollider from '../src/components/collision/polygon-collider.js';

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const scene = new Scene([
  new PolygonRenderer(canvas),
  new PolygonCollision(canvas),
  {
    update(time, entityManager) {
      const target = entityManager.getEntityWithTag('a');
      entityManager.getComponent(target, Transform).rotation += (
        50 * time.deltaTime
      );
    },
  },
]);

const entityA = scene.entityManager.createEntity('a');
scene.entityManager.addComponents(
  entityA,
  new Ellipse(1, 1, 3),
  new PolygonMaterial({
    fillStyle: (() => {
      const grd = context.createLinearGradient(0, 0, 600, 0);
      grd.addColorStop(0, 'blue');
      grd.addColorStop(1, 'red');
      return grd;
    })(),
    strokeStyle: 'red',
  }),
  new PolygonCollider(0, 0),
  new Transform(
    new Vector2D(canvas.width/2, canvas.height/2),
    0,
    new Vector2D(canvas.width / 2, 50),
  ),
);

const entityB = scene.entityManager.createEntity('b');
scene.entityManager.addComponents(
  entityB,
  new Rect(50, 50),
  new PolygonMaterial({
    fillStyle: 'gray',
    strokeStyle: 'black',
  }),
  new PolygonCollider(0, 0),
  new Transform(
    new Vector2D(100, 100),
    0,
  ),
);

scene.start();
