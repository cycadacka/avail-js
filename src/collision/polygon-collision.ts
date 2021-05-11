import PolygonCollider from "./polygon-collider";
import Polygon from "shapes/polygon";
import { BoundingBox } from "shapes/types";
import Transform from "common/transform";
import Vector2D from "math/vector2d";
import EntityManager from "core/entity-manager";
import System, { SystemInfo } from "core/types";
import rectangleRectangle from "./util/rectangle-rectangle";
import polygonPolygon from "./util/polygon-polygon";
import { makeAABB } from "./util/make-aabb";
import CollisionMatrix from "./collision-matrix";
import { CollisionInfo } from './types';
import CollisionEventImpl, { CollisionEvent } from './collision-event-impl';
import getUUID from '../util/get-uuid';

interface Entity {
  components: {
    polygonCollider: PolygonCollider;
    transform: Transform;
    polygon: Polygon;
  };
  obb: BoundingBox;
  aabb: BoundingBox;
}

/**
 * Handles collision between shapes.
 *
 * @class PolygonCollision
 */
class PolygonCollision implements System {
  private entityOBBs: Map<string, BoundingBox> = new Map();
  private entityCollisions: Map<
    string,
    Map<string, CollisionInfo>
  > = new Map();
  private collisionMatrix: CollisionMatrix | null;

  private _collisionEvent: CollisionEventImpl = new CollisionEventImpl();

  constructor(collisionMatrix: CollisionMatrix | null = null) {
    this.collisionMatrix = collisionMatrix;
  }

  /**
   * @memberof PolygonCollision
   */
  fixedUpdate({ entityManager }: SystemInfo): void {
    this.entityOBBs = new Map();
    this.entityCollisions = new Map();

    const entities = entityManager.getEntitiesWithComponent(PolygonCollider);
    const entityAABBs = new Map<string, BoundingBox>();
    const entityVertices = new Map<string, Vector2D[]>();

    const frameUUID = getUUID();

    for (const firstID of entities) {
      const first = this.constructEntity(firstID, entityAABBs, entityManager);

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
          entityManager
        );

        // Check if needed components are available.
        if (second == null) {
          continue;
        }

        const firstLayer = first.components.polygonCollider.collisionLayer;
        const secondLayer = second.components.polygonCollider.collisionLayer;
        const collisionOccurred = this.collisionMatrix?.compareLayer(
          typeof firstLayer === "string" ? firstLayer : firstLayer?.name ?? undefined,
          typeof secondLayer === "string" ? secondLayer : secondLayer?.name ?? undefined
        );
        
        if (collisionOccurred != null && !collisionOccurred) {
          continue;
        }

        if (
          rectangleRectangle(
            first.aabb.min,
            first.aabb.max,
            second.aabb.min,
            second.aabb.max
          )
        ) {
          let firstVertices = entityVertices.get(firstID);
          if (!firstVertices) {
            const matrix = first.components.transform.localToWorldMatrix;

            firstVertices = first.components.polygon.vertices.map(
              (value) => matrix.multiplyVector2(value)
            );
            entityVertices.set(firstID, firstVertices);
          }

          let againstVertices = entityVertices.get(secondID);
          if (!againstVertices) {
            const matrix = second.components.transform.localToWorldMatrix;

            againstVertices = second.components.polygon.vertices.map(
              (value) => Object.assign(matrix.multiplyVector2(value), {
                next: value.next,
                previous: value.previous,
              })
            );
            entityVertices.set(secondID, againstVertices);
          }

          const collisionInfo = polygonPolygon(firstVertices, againstVertices);
          if (collisionInfo.contacts.length > 0) {
            let firstStore = this.entityCollisions.get(firstID);
            if (firstStore == undefined) {
              firstStore = this.entityCollisions
                .set(firstID, new Map())
                .get(firstID)!;
            }
            firstStore.set(secondID, collisionInfo);

            let secondStore = this.entityCollisions.get(secondID);
            if (secondStore == undefined) {
              secondStore = this.entityCollisions
                .set(secondID, new Map())
                .get(secondID)!;
            }
            secondStore.set(firstID, collisionInfo);

            this._collisionEvent.invoke(firstID, secondID, collisionInfo, frameUUID);
            this._collisionEvent.invoke(secondID, firstID, collisionInfo, frameUUID);
          }
        }
      }
    }
  }

  public get collisionEvent(): CollisionEvent {
    return this._collisionEvent;
  }

  public getCollisions(
    entity: string
  ): Generator<CollisionInfo & { other: string }, number, void> {
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
