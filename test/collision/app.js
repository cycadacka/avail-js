import Transform from '../../src/components/transform.js';
import Scene from '../../src/core/scene.js';
import Vector2D from '../../src/math/vector2d.js';
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
      const target = entityManager.getEntityWithTag('b');
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
    new Vector2D(6.087073263430021, 5.796117257901679),
    new Vector2D(5.142875915474218, 5.995189650983239),
    new Vector2D(4.235944256370445, 5.901072012313152),
    new Vector2D(5.236025919164746, 3.151866121009487),
    new Vector2D(2.676658574077782, 4.897915861832056),
    new Vector2D(0.021382742098321028, 5.488184374541131),
    new Vector2D(-1.794356317649905, 3.57398702658533),
    new Vector2D(1.2367057654646252, 3.717888700814888),
    new Vector2D(1.6686894345460699, 1.5115814747203027),
    new Vector2D(3.3984730270568333, 3.1555474629666707),
    new Vector2D(3.9129267365699794, 0.2038827420983207),
    new Vector2D(4.641568528970227, -0.10296742876101739),
    new Vector2D(5.764055743629556, 0.09892798768684719),
    new Vector2D(6.623140747501919, 0.47702276787940256),
    new Vector2D(9.074730314811108, 0.34763969372349823),
    new Vector2D(7.796117257901679, 1.9129267365699794),
    new Vector2D(9.15380076209435, 4.931846306748005),
    new Vector2D(7.901072012313152, 3.7640557436295556),
    new Vector2D(7.522977232120597, 4.623140747501919),
    new Vector2D(5.874026972943167, 3.3025080925888837),
  ]),
  new PolygonMaterial({
    fillStyle: 'gray',
    strokeStyle: 'black',
  }),
  new PolygonCollider(0, 0),
  new Transform(
    new Vector2D(100, 100),
    0,
    new Vector2D(15, 15),
  ),
);

scene.start();
