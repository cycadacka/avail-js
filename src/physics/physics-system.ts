import PolygonCollisionSystem from 'collision/polygon-collision-system';
import { CollisionInfoUnion } from 'collision/types';
import System, { SystemInfo } from 'core/types';
import EntityManager from 'core/entity-manager';
import RigidBody from './rigid-body';
import Transform from 'common/transform';
import Vector2D from 'math/vector2d';

class PhysicsSystem implements System {
  private entityManager? : EntityManager;

  constructor(polygonCollisionSystem: PolygonCollisionSystem) {
    polygonCollisionSystem.subscribe("stay", "ANY", this.onCollisionStay.bind(this));
  }

  start(info: SystemInfo) {
    this.entityManager = info.entityManager;
  }

  fixedUpdate(info: SystemInfo) {
    const entities = info.entityManager.getEntitiesWithComponent(RigidBody);
    
    for (let i = 0; i < entities.length; i++) {
      const transform = info.entityManager.getComponent(entities[i], Transform)!;
      const rigidBody = info.entityManager.getComponent(entities[i], RigidBody)!;

      transform.position.x += rigidBody.velocity.x * info.time.fixedDeltaTime;
      transform.position.y += rigidBody.velocity.y * info.time.fixedDeltaTime;
      transform.rotation += rigidBody.angularVelocity * info.time.fixedDeltaTime;

      rigidBody.addForceAtLocalPosition(new Vector2D(0, 9.81 * 25 * info.time.fixedDeltaTime), Vector2D.zero);
    }
  }

  onCollisionStay(collision: CollisionInfoUnion) {
    const firstTransform = this.entityManager!.getComponent(
      collision.self,
      Transform
    )!;

    const firstRigidBody = this.entityManager!.getComponent(
      collision.self,
      RigidBody
    );

    const secondTransform = this.entityManager!.getComponent(
      collision.other,
      Transform
    )!;
    
    const secondRigidBody = this.entityManager!.getComponent(
      collision.other,
      RigidBody
    );

    if (firstRigidBody)
      this.calcCollisionResponse(collision, firstTransform, firstRigidBody);

    if (secondRigidBody)
      this.calcCollisionResponse(collision, secondTransform, secondRigidBody, -1);
  }

  private calcCollisionResponse(collision: CollisionInfoUnion, transform: Transform, rigidBody: RigidBody, normalMultiplier: number=1) {
    const normalSum = Vector2D.zero;
    for (let i = 0; i < collision.contacts.length; i++) {
      const modifiedNormal = collision.contacts[i].normal.clone().multiply(normalMultiplier);
    
      const newVelocity = Vector2D.project(
        new Vector2D(rigidBody.velocity.x, rigidBody.velocity.y),
        modifiedNormal.normalized
      );
      rigidBody.velocity.x = newVelocity.x;
      rigidBody.velocity.y = newVelocity.y;
  
      normalSum.add(modifiedNormal);
    }
  
    transform.position.add(normalSum.divide(collision.contacts.length));
  }
}

export default PhysicsSystem;
