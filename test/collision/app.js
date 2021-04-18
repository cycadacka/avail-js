import Transform from '../../src/components/transform.js';
import Scene from '../../src/core/scene.js';
import Vector2D from '../../src/math/vector2d.js';
import Rect from '../../src/components/shapes/rect.js';
import Ellipse from '../../src/components/shapes/ellipse.js';
import PolygonRenderer from '../../src/systems/rendering/polygon-renderer.js';
import PolygonCollision from '../../src/systems/collision/polygon-collision.js';
import PolygonMaterial from
  '../../src/components/rendering/polygon-material.js';
import PolygonCollider from
  '../../src/components/collision/polygon-collider.js';
import SimplePolygon from '../../src/components/shapes/simple-polygon.js';

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
  {
    update(time, entityManager) {
      const target = entityManager.getEntityWithTag('a');
      const simplePolygon = entityManager.getComponent(target, SimplePolygon);
      const matrix = entityManager.getComponent(target, Transform)
        .localToWorldMatrix;

      context.save();

      const triangles = simplePolygon.partition.triangle();
      for (let i = 0; i < triangles.length; i++) {
        context.beginPath();

        context.moveTo(...matrix.multiplyVector2(triangles[i][0]));

        for (let k = 0; k < triangles[i].length; k++) {
          context.lineTo(...matrix.multiplyVector2(triangles[i][k]));
        }

        context.lineTo(...matrix.multiplyVector2(triangles[i][0]));

        const color = new Array(6).fill('').map(() => {
          return '0123456789ABCDEF'[Math.round(Math.random() * 15)];
        }).join('');
        context.strokeStyle = '#' + color;
        context.stroke();

        context.closePath();
      }

      context.restore();
    },
  },
]);

// Set-up an entity whose tag is 'a'
const entityA = scene.entityManager.createEntity('a');
scene.entityManager.addComponents(
  entityA,
  new Ellipse(1, 2, 25),
  new PolygonMaterial({
    fillStyle: gradientEntityA,
    strokeStyle: 'white',
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
  new SimplePolygon([
    new Vector2D(-25, -25),
    new Vector2D(0, 0),
    new Vector2D(25, -25),
    new Vector2D(25, 25),
    new Vector2D(-25, 25),
  ], true),
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
