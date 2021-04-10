import PolygonCollider2d from
  '../src/components/collision/polygon2d-collider.js';
import Transform from '../src/components/transform.js';
import Scene from '../src/core/scene.js';
import Vector2D from '../src/math/vector2d.js';
import PolygonRenderer2d from
  '../src/systems/rendering/polygon2d-renderer.js';

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');

const scene = new Scene([new PolygonRenderer2d(canvas)]);

const entityA = scene.entityManager.createEntity('square');
scene.entityManager.addComponents(
  entityA,
  new PolygonCollider2d([
    new Vector2D(-1, -1), new Vector2D(1, -1),
    new Vector2D(1, 1), new Vector2D(-1, 1),
  ]),
  new Transform(
    new Vector2D(canvas.width/2, canvas.height/2),
    0,
    new Vector2D(50, 50),
  ),
);

// const entityB = scene.entityManager.createEntity();

scene.start();
