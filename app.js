import Scene from './js/core/scene.js';
import Transform from './js/components/transform.js';
import Vector2 from './js/math/vector2.js';

const scene = new Scene();

const a = scene.entityManager.createEntity();
const b = scene.entityManager.createEntity();
const c = scene.entityManager.createEntity();
const aTs = new Transform(Vector2.zero, 45, Vector2.one.multiply(6));
const bTs = new Transform(Vector2.one, 45, Vector2.one.multiply(1/6));
const cTs = new Transform(Vector2.one, -45, Vector2.one);

console.log(
  scene.entityManager
  .addChildToEntity(a, b)
  .addChildToEntity(b, c)
  .addComponent(a, aTs)
  .addComponent(b, bTs)
  .addComponent(c, cTs)
);
console.log(a, '=>', b, '=>', c);

console.group('Transform:');
console.log('position', aTs.position.clone(), '=>', bTs.position.clone(), '=>', cTs.position.clone());
console.log('rotation', aTs.rotation, '=>', bTs.rotation, '=>', cTs.rotation);
console.log('scale', aTs.scale.clone(), '=>', bTs.scale.clone(), '=>', cTs.scale.clone());
console.groupEnd();

console.group('Component Removing:');
console.log(scene.entityManager.removeComponents(cTs).removeComponentsOfType(a, Transform));

if (scene.entityManager.getComponent(c, Transform) || scene.entityManager.getComponents(a, Transform).length > 0) {
  throw new Error('Failed to remove components (Transform of c, Transform of a).');
}
console.groupEnd();

console.group('Entity Destruction:');
console.log(scene.entityManager.destroyEntity(a));
console.groupEnd();

