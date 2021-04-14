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

const gradientEntityA = context.createLinearGradient(0, 0, 600, 0);
gradientEntityA.addColorStop(0, 'blue');
gradientEntityA.addColorStop(1, 'red');

// Set-up scene with system (called in array order)
const scene = new Scene([
  {
    update(time, entityManager) {
      const target = entityManager.getEntityWithTag('a');
      const transform = entityManager.getComponent(target, Transform);

      transform.rotation += 50 * time.deltaTime;
    },
  },
  new PolygonRenderer(canvas),
  new PolygonCollision(canvas),
  {
    update(time, entityManager) {
      const target = entityManager.getEntityWithTag('a');
      const collider = entityManager.getComponent(target, PolygonCollider);
      const material = entityManager.getComponent(target, PolygonMaterial);

      if (collider.narrowCollided) {
        material.fillStyle = 'red';
      } else if (collider.broadCollided) {
        material.fillStyle = 'orange';
      } else {
        material.fillStyle = gradientEntityA;
      }

      collider.broadCollided = false;
      collider.narrowCollided = false;
    },
  },
]);

// Set-up an entity whose tag is 'a'
const entityA = scene.entityManager.createEntity('a');
scene.entityManager.addComponents(
  entityA,
  new Ellipse(1, 2),
  new PolygonMaterial({
    fillStyle: gradientEntityA,
    strokeStyle: 'red',
  }),
  new PolygonCollider(0, 0),
  new Transform(
    new Vector2D(canvas.width/2, canvas.height/2),
    0,
    new Vector2D(canvas.width / 2, 50),
  ),
);

// Set-up an entity whose tag is 'b'
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
