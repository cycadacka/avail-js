import PolygonCollider from './polygon-collider';
import Polygon from 'shapes/polygon';
import { BoundingBox } from 'shapes/types';
import Transform from 'common/transform';
import Vector2D from 'math/vector2d';
import EntityManager from 'core/entity-manager';
import System, { SystemInfo } from 'core/types';
import rectangleRectangle from './util/rectangle-rectangle';
import polygonPolygon from './util/polygon-polygon';
import { makeAABB } from './util/make-aabb';
import CollisionMatrix from './collision-matrix';
import { CollisionInfo } from './types';
import UtilityEvent from 'util/utility-event';

interface Entity {
  components: {
    polygonCollider: PolygonCollider;
    transform: Transform;
    polygon: Polygon;
  };
  obb: BoundingBox;
  aabb: BoundingBox;
}

type CollisionInfoUnion = CollisionInfo & {
  self: string;
  other: string;
};

/**
 * Handles collision between shapes.
 *
 * @class PolygonCollision
 */
class PolygonCollision implements System {
  protected entityOBBs = new Map<string, BoundingBox>();
  protected entityCollisions = {
    old: new Map<string, Map<string, CollisionInfo>>(),
    new: new Map<string, Map<string, CollisionInfo>>(),
  };
  protected collisionEvents = {
    enter: new Map<
      string,
      UtilityEvent<{ collisionInfo: CollisionInfoUnion }>
    >(),
    stay: new Map<
      string,
      UtilityEvent<{ collisionInfo: CollisionInfoUnion }>
    >(),
    exit: new Map<
      string,
      UtilityEvent<{ collisionInfo: CollisionInfoUnion }>
    >(),
  };
  protected collisionMatrix: CollisionMatrix | null;

  constructor(collisionMatrix?: CollisionMatrix) {
    this.collisionMatrix = collisionMatrix ?? null;
  }

  /**
   * @memberof PolygonCollision
   */
  fixedUpdate({ entityManager }: SystemInfo): void {
    this.entityOBBs = new Map();
    this.entityCollisions.old = new Map(this.entityCollisions.new);
    this.entityCollisions.new = new Map();

    const entityAABBs = new Map<string, BoundingBox>();
    const entityVertices = new Map<string, Vector2D[]>();
    const entities = entityManager.getEntitiesWithComponent(PolygonCollider);

    for (const firstID of entities) {
      const first = this.constructEntity(firstID, entityAABBs, entityManager);

      // Check if needed components are available.
      if (first == null) {
        continue;
      }

      for (const secondID of entities) {
        if (
          firstID === secondID || // Collision against self (which is impossible).
          this.entityCollisions.new.get(firstID)?.has(secondID) // Collision between has already happened in the same frame.
        ) {
          continue;
        }

        const second = this.constructEntity(
          secondID,
          entityAABBs,
          entityManager
        );

        // Check if needed components are available.
        if (second == null) {
          continue;
        }

        const firstCollisionInfo = this.testPolygonCollision(
          first,
          firstID,
          second,
          secondID,
          entityVertices
        );

        if (firstCollisionInfo.contacts.length <= 0) {
          /** Invoke events of message "exit" **/

          if (this.entityCollisions.old.get(firstID)?.has(secondID)) {
            const firstUnion = {
              contacts: [],
              self: firstID,
              other: secondID,
            };

            const secondUnion = {
              contacts: [],
              self: secondID,
              other: firstID,
            }

            this.invokeEvent(firstUnion, secondUnion, "exit");
          }

          continue;
        }

        const secondCollisionInfo = {
          contacts: firstCollisionInfo.contacts.map((value) => {
            return {
              point: value.point.clone(),
              normal: value.normal.clone(),
            };
          }),
        };

        let firstStore = this.entityCollisions.new.get(firstID);
        if (firstStore == undefined) {
          firstStore = this.entityCollisions.new
            .set(firstID, new Map())
            .get(firstID)!;
        }
        firstStore.set(secondID, firstCollisionInfo);

        let secondStore = this.entityCollisions.new.get(secondID);
        if (secondStore == undefined) {
          secondStore = this.entityCollisions.new
            .set(secondID, new Map())
            .get(secondID)!;
        }
        secondStore.set(firstID, secondCollisionInfo);

        /** Invoke events of message "enter" and "stay" **/

        const firstUnion = Object.assign(firstCollisionInfo, {
          self: firstID,
          other: secondID,
        });

        const secondUnion = Object.assign(secondCollisionInfo, {
          self: secondID,
          other: firstID,
        });

        if (!this.entityCollisions.old.get(firstID)?.has(secondID)) {
          this.invokeEvent(firstUnion, secondUnion, 'enter');
        } else {
          this.invokeEvent(firstUnion, secondUnion, 'stay');
        }
      }
    }
  }

  subscribe(
    message: 'enter' | 'stay' | 'exit',
    entity: string,
    handler: (collisionInfo: CollisionInfoUnion) => void
  ) {
    let store = this.collisionEvents[message].get(entity);
    if (!store) {
      store = this.collisionEvents[message]
        .set(
          entity,
          new UtilityEvent<{
            collisionInfo: CollisionInfoUnion;
          }>()
        )
        .get(entity)!;
    }
    store.subscribe((params) => {
      handler(params.collisionInfo);
    });
  }

  getCollisions(entity: string): Generator<CollisionInfoUnion, number, void> {
    const collisions = this.entityCollisions.new.get(entity);

    return (function* () {
      let length = 0;

      if (collisions != null) {
        for (const [other, collision] of collisions) {
          length += 1;
          yield Object.assign(collision, {
            self: entity,
            other,
          });
        }
      }

      return length;
    })();
  }

  private invokeEvent(firstUnion: CollisionInfoUnion, secondUnion: CollisionInfoUnion, message: 'enter' | 'stay' | 'exit') {
    this.collisionEvents[message].get(firstUnion.self)?.invoke({
      collisionInfo: firstUnion,
    });

    this.collisionEvents[message].get(secondUnion.self)?.invoke({
      collisionInfo: secondUnion,
    });
  }

  /**
   * Test collision between two entities with polygon components.
   *
   * @private
   * @param {Entity} first
   * @param {string} firstID
   * @param {Entity} second
   * @param {string} secondID
   * @param {Map<string, Vector2D[]>} entityVertices
   * @return {CollisionInfo}
   * @memberof PolygonCollision
   */
  private testPolygonCollision(
    first: Entity,
    firstID: string,
    second: Entity,
    secondID: string,
    entityVertices: Map<string, Vector2D[]>
  ): CollisionInfo {
    const firstLayer = first.components.polygonCollider.collisionLayer;
    const secondLayer = second.components.polygonCollider.collisionLayer;
    const allowCollision = this.collisionMatrix?.compareLayer(
      typeof firstLayer === 'string' ? firstLayer : firstLayer?.name,
      typeof secondLayer === 'string' ? secondLayer : secondLayer?.name
    );

    if (
      allowCollision == null ||
      !allowCollision ||
      !rectangleRectangle(
        first.aabb.min,
        first.aabb.max,
        second.aabb.min,
        second.aabb.max
      )
    ) {
      return {
        contacts: [],
      };
    }

    let firstVertices = entityVertices.get(firstID);
    if (!firstVertices) {
      const matrix = first.components.transform.localToWorldMatrix;

      firstVertices = first.components.polygon.vertices.map((value) =>
        matrix.multiplyVector2(value)
      );
      entityVertices.set(firstID, firstVertices);
    }

    let againstVertices = entityVertices.get(secondID);
    if (!againstVertices) {
      const matrix = second.components.transform.localToWorldMatrix;

      againstVertices = second.components.polygon.vertices.map((value) =>
        matrix.multiplyVector2(value)
      );
      entityVertices.set(secondID, againstVertices);
    }

    return polygonPolygon(firstVertices, againstVertices);
  }

  /**
   * Constructs the entity and retrieves the needed components and
   * object-aligned bounding boxes.
   *
   * @private
   * @param {string} entity
   * @param {Map<string, BoundingBox>} entityAABBs
   * @param {EntityManager} entityManager
   * @return {(Entity | null)}
   * @memberof PolygonCollision
   */
  private constructEntity(
    entity: string,
    entityAABBs: Map<string, BoundingBox>,
    entityManager: EntityManager
  ): Entity | null {
    // Get components
    const components = {
      polygonCollider: entityManager.getComponent(entity, PolygonCollider),
      polygon: entityManager.getComponent(entity, Polygon),
      transform: entityManager.getComponent(entity, Transform),
    };

    if (
      !(
        components.polygonCollider &&
        components.polygon &&
        components.transform
      )
    ) {
      return null;
    }

    // Get object-aligned bounding-box
    let obb = this.entityOBBs.get(entity);
    if (!obb) {
      obb = components.polygon.getOBB();
      this.entityOBBs.set(entity, obb);
    }

    // Get axis-aligned bounding-box
    let aabb = entityAABBs.get(entity)!;
    if (!aabb) {
      aabb = makeAABB(obb, components.transform);
      entityAABBs.set(entity, aabb);
    }

    return <Entity>{ components, obb, aabb };
  }
}

export default PolygonCollision;
