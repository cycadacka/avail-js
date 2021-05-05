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

interface PolygonCollisionEntity {
  components: {
    polygonCollider: PolygonCollider;
    polygon: Polygon;
    transform: Transform;
  };
  obb: BoundingBox;
  aabb: BoundingBox;
};

export interface PolygonCollisionInfo {
  current: string;
  against: string;
}

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
   * @returns {PolygonCollisionEntity | null} Constructed entity; null if it
   * fails.
   * @memberof PolygonCollision
   */
  private constructEntity(
    entity: string,
    entityManager: EntityManager, 
    entityAABBs: Map<string, BoundingBox>
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
    const obb = this.entity2obb.get(entity) ?? components.polygon.obb;
    if (!this.entity2obb.has(entity)) {
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

  protected onCollision(entityManager: EntityManager, first: PolygonCollisionEntity, idFirst: string, second: PolygonCollisionEntity, idSecond: string) {
    const lfirst = entityManager.getComponents(idFirst, CollisionListener);
    const lsecond = entityManager.getComponents(idSecond, CollisionListener);
    const llength = Math.max(lfirst.length, lsecond.length);

    for (let i = 0; i < llength; i++) {
      if (i < lfirst.length) {
        lfirst[i].callback({ current: idFirst, against: idSecond });
      }

      if (i < lsecond.length) {
        lsecond[i].callback({ current: idSecond, against: idFirst });
      }
    }
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

    for (const idFirst of entities) {
      const first = this.constructEntity(
        idFirst,
        entityManager,
        entityAABBs,
      );

      if (first === null) { // Check if needed components are available.
        continue;
      }

      for (const idSecond of entities) {
        if (
          idFirst === idSecond ||
          entityCollisions.has(idFirst + idSecond) ||
          entityCollisions.has(idSecond + idFirst)
        ) { // Check if the second is itself or collision between has already happened.
          continue;
        }

        const second = this.constructEntity(
          idSecond,
          entityManager,
          entityAABBs,
        );

        if (second === null) { // Check if needed components are available.
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

          const currentMatrix = (
            first.components.transform.localToWorldMatrix
          );
          let currentVertices = entityVertices.get(idFirst);
          if (!currentVertices) {
            currentVertices = first.components.polygon.vertices.map(
              value => currentMatrix.multiplyVector2(value),
            );
            entityVertices.set(idFirst, currentVertices);
          }

          const againstMatrix = (
            second.components.transform.localToWorldMatrix
          );
          let againstVertices = entityVertices.get(idSecond);
          if (!againstVertices) {
            againstVertices = second.components.polygon.vertices.map(
              value => againstMatrix.multiplyVector2(value),
            );
            entityVertices.set(idSecond, againstVertices);
          }

          if (polygonPolygonCollision(currentVertices, againstVertices)) {
            this.onCollision(entityManager, first, idFirst, second, idSecond);
            entityCollisions.set(idFirst + idSecond, [ first, second ]);
          }
        }
        
      }
    }
  }
}

export default PolygonCollision;
