import PolygonCollider from './polygon-collider';
import Polygon from 'shapes/polygon';
import { BoundingBox } from 'shapes/types';
import Transform from 'common/transform';
import Vector2D from 'math/vector2d';
import EntityManager from 'core/entity-manager';
import System, { SceneInfo } from 'core/types';
import rectangleRectangle from './util/rectangle-rectangle';
import polygonPolygon from './util/polygon-polygon';
import { toAABB } from './util/to-aabb';

interface Entity {
  components: {
    polygonCollider: PolygonCollider;
    transform: Transform;
    polygon: Polygon;
  };
  obb: BoundingBox;
  aabb: BoundingBox;
};

interface EntityCollision {
  contacts: {
    point: Vector2D;
    normal: Vector2D;
  }[];
}

/**
 * Handles collision between shapes.
 *
 * @class PolygonCollision
 */
class PolygonCollision implements System {
  private entityOBBs: Map<string, BoundingBox> = new Map();
  private entityCollisions: Map<string, Map<string, EntityCollision>> = new Map();

  /**
   * @memberof PolygonCollision
   */
  fixedUpdate({ entityManager }: SceneInfo): void {
    this.entityOBBs = new Map();
    this.entityCollisions = new Map();

    const entities = entityManager.getEntitiesWithComponent(PolygonCollider);
    const entityAABBs = new Map<string, BoundingBox>();
    const entityVertices = new Map<string, Vector2D[]>();

    for (const firstID of entities) {
      const first = this.constructEntity(
        firstID,
        entityAABBs,
        entityManager,
      );

      // Check if needed components are available.
      if (first == null) {
        continue;
      }

      for (const secondID of entities) {
        // Check if the second is itself or collision between has already happened.
        if (
          firstID === secondID ||
          this.entityCollisions.get(firstID)?.has(secondID)
        ) {
          continue;
        }

        const second = this.constructEntity(
          secondID,
          entityAABBs,
          entityManager,
        );

        // Check if needed components are available.
        if (second == null) {
          continue;
        }

        if (
          rectangleRectangle(
            first.aabb.min,
            first.aabb.max,
            second.aabb.min,
            second.aabb.max,
          )
        ) {

          let firstVertices = entityVertices.get(firstID);
          if (!firstVertices) {
            const matrix = first.components.transform.localToWorldMatrix;
            
            firstVertices = first.components.polygon.vertices.map(
              (value) => matrix.multiplyVector2(value),
            );
            entityVertices.set(firstID, firstVertices);
          }

          let againstVertices = entityVertices.get(secondID);
          if (!againstVertices) {
            const matrix = second.components.transform.localToWorldMatrix;

            againstVertices = second.components.polygon.vertices.map(
              (value) => matrix.multiplyVector2(value),
            );
            entityVertices.set(secondID, againstVertices);
          }

          const collisionInfo = polygonPolygon(firstVertices, againstVertices);
          if (collisionInfo.contacts.length > 0) {
            let firstStore = this.entityCollisions.get(firstID);
            if (firstStore == undefined) {
              firstStore = this.entityCollisions.set(firstID, new Map()).get(firstID)!;
            }
            firstStore.set(secondID, collisionInfo);

            let secondStore = this.entityCollisions.get(secondID);
            if (secondStore == undefined) {
              secondStore = this.entityCollisions.set(secondID, new Map()).get(secondID)!;
            }
            secondStore.set(firstID, collisionInfo);
          }
        }
      }
    }
  }

  public getCollisions(entity: string): Generator<EntityCollision & { other: string }, number, void> {
    const collisions = this.entityCollisions.get(entity);

    return (function* () {
      let length = 0;

      if (collisions != null) {
        for (const [other, collision] of collisions) {
          length += 1;
          yield Object.assign(collision, {
            other,
          });
        }
      }
      
      return length;
    })();
  }

  /**
   * Constructs the entity and retrieves the needed components and
   * object-aligned bounding boxes.
   *
   * @returns {Entity | null} Constructed entity; null if it fails.
   * @memberof PolygonCollision
   */
  private constructEntity(
    entity: string,
    entityAABBs: Map<string, BoundingBox>,
    entityManager: EntityManager, 
  ): Entity | null {
    // Get components
    const components = {
      polygonCollider: entityManager.getComponent(entity, PolygonCollider),
      polygon: entityManager.getComponent(entity, Polygon),
      transform: entityManager.getComponent(entity, Transform),
    };

    if (!(components.polygonCollider && components.polygon && components.transform)) {
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
      aabb = toAABB(obb, components.transform);
      entityAABBs.set(entity, aabb);
    }

    return <Entity>{ components, obb, aabb };
  }
}

export default PolygonCollision;
