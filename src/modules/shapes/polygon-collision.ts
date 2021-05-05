import PolygonCollider from './polygon-collider';
import Polygon from './polygon';
import { BoundingBox } from 'types';
import {
  obb2aabb,
  rectangleRectangleCollision,
  polygonPolygonCollision,
} from './util/collision';
import Transform from 'modules/transform';
import Vector2D from 'math/vector2d';
import EntityManager from 'core/entity-manager';
import System, { SceneInfo } from 'core/system';
import CollisionListener from '../collision-listener';
import { ContactPoint } from '../collision-listener';

interface PolygonCollisionEntity {
  components: {
    polygonCollider: PolygonCollider;
    polygon: Polygon;
    transform: Transform;
  };
  obb: BoundingBox;
  aabb: BoundingBox;
};

/**
 * Handles collision between shapes.
 *
 * @class PolygonCollision
 */
class PolygonCollision implements System {
  private entity2obb: Map<string, BoundingBox>;

  /**
   * Creates an instance of PolygonCollision.
   *
   * @memberof PolygonCollision
   */
  constructor() {
    this.entity2obb = new Map();
  }

  /**
   * Constructs the entity and retrieves the needed components and
   * object-aligned bounding boxes.
   *
   * @returns {PolygonCollisionEntity | null} Constructed entity; null if it fails.
   * @memberof PolygonCollision
   */
  private constructEntity(
    entity: string,
    entityAABBs: Map<string, BoundingBox>,
    entityManager: EntityManager, 
  ): PolygonCollisionEntity | null {
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
    let obb = this.entity2obb.get(entity);
    if (!obb) {
      obb = components.polygon.obb;
      this.entity2obb.set(entity, obb);
    }

    // Get axis-aligned bounding-box
    let aabb = entityAABBs.get(entity)!;
    if (!aabb) {
      aabb = obb2aabb(obb, components.transform);
      entityAABBs.set(entity, aabb);
    }

    return <PolygonCollisionEntity>{ components, obb, aabb };
  }

  /**
   * @memberof PolygonCollision
   */
  fixedUpdate({ entityManager }: SceneInfo): void {
    const entities = entityManager.getEntitiesWithComponent(PolygonCollider);
    const entityAABBs = new Map<string, BoundingBox>();
    const entityVertices = new Map<string, Vector2D[]>();
    const entityCollisions = new Map<string, [
      PolygonCollisionEntity, PolygonCollisionEntity
    ]>();

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
          entityCollisions.has(firstID + secondID) ||
          entityCollisions.has(secondID + firstID)
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
          rectangleRectangleCollision(
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

          if (polygonPolygonCollision(firstVertices, againstVertices)) {
            // TODO: Calculate contact points.
            const firstListeners = entityManager.getComponents(
              firstID, CollisionListener
            );
            const secondListeners = entityManager.getComponents(
              secondID, CollisionListener
            );
            const contacts: ContactPoint[] = [];
        
            const length = Math.max(firstListeners.length, secondListeners.length);
            for (let i = 0; i < length; i++) {
              if (i < firstListeners.length) {
                firstListeners[i].fire({
                  entity: firstID,
                  otherEntity: secondID,
                  contacts: contacts,
                });
              }
        
              if (i < secondListeners.length) {
                secondListeners[i].fire({
                  entity: secondID,
                  otherEntity: firstID,
                  contacts: contacts,
                });
              }
            }

            entityCollisions.set(firstID + secondID, [ first, second ]);
          }
        }
        
      }
    }
  }
}

export default PolygonCollision;
