import PolygonCollider from './polygon-collider';
import Polygon from './polygon';
import { BoundingBox } from 'types';
import {
  aabb as uAABB,
  rectangleRectangleCollision,
  polygonPolygonCollision,
} from './util/collision';
import Transform from 'modules/transform';
import Vector2D from 'math/vector2d';
import EntityManager from 'core/entity-manager';
import System, { SceneInfo } from 'core/system';

interface PolygonCollisionEntity {
  components: {
    polygonCollider: PolygonCollider;
    transform: Transform;
    simplePolygon: Polygon;
  };
  obb: BoundingBox;
  aabb: BoundingBox;
}

/**
 * Handles collision between shapes.
 *
 * @class PolygonCollision
 */
System.implement();
class PolygonCollision implements System {
  private context: CanvasRenderingContext2D; // <-- For debugging
  private entity2obb: Map<string, BoundingBox>;

  /**
   * Creates an instance of PolygonCollision.
   *
   * @memberof PolygonCollision
   */
  constructor(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d')!;
    this.entity2obb = new Map();
  }

  /**
   * Constructs the entity and retrieves the needed components and
   * object-aligned bounding boxes.
   *
   * @memberof PolygonCollision
   */
  private constructPolygonCollisionManagerEntity(
    entity: string,
    entityManager: EntityManager, 
    entity2aabb: Map<string, BoundingBox>
  ): PolygonCollisionEntity {
    // Get components.
    const components = {
      polygonCollider: entityManager.getComponent(entity, PolygonCollider)!,
      transform: entityManager.getComponent(entity, Transform)!,
      simplePolygon: entityManager.getComponent(entity, Polygon)!,
    };

    // Get object-aligned bounding-box
    const obb = this.entity2obb.get(entity) ?? components.simplePolygon.obb;
    if (!this.entity2obb.has(entity)) {
      this.entity2obb.set(entity, obb);
    }

    // Get axis-aligned bounding-box
    let aabb = entity2aabb.get(entity)!;
    if (!aabb) {
      aabb = uAABB(obb, components.transform);
      entity2aabb.set(entity, aabb);
    }

    return { components, obb, aabb };
  }


  /**
   * @memberof PolygonCollision
   */
  fixedUpdate({ entityManager }: SceneInfo): void {
    const entities = entityManager.getEntitiesWithComponent(PolygonCollider);

    const entity2aabb = new Map<string, BoundingBox>();
    const entity2vertices = new Map<string, Vector2D[]>();

    for (const currentID of entities) {
      const current = this.constructPolygonCollisionManagerEntity(
        currentID,
        entityManager,
        entity2aabb,
      );

      for (const againstID of entities) {
        if (currentID !== againstID) {
          const against = this.constructPolygonCollisionManagerEntity(
            againstID,
            entityManager,
            entity2aabb,
          );

          if (
            rectangleRectangleCollision(
              current.aabb.min,
              current.aabb.max,
              against.aabb.min,
              against.aabb.max,
            )
          ) {

            const currentMatrix = (
              current.components.transform.localToWorldMatrix
            );
            let currentVertices = entity2vertices.get(currentID);
            if (!currentVertices) {
              currentVertices = current.components.simplePolygon.vertices.map(
                value => currentMatrix.multiplyVector2(value),
              );
              entity2vertices.set(currentID, currentVertices);
            }

            const againstMatrix = (
              against.components.transform.localToWorldMatrix
            );
            let againstVertices = entity2vertices.get(againstID);
            if (!againstVertices) {
              againstVertices = against.components.simplePolygon.vertices.map(
                value => againstMatrix.multiplyVector2(value),
              );
              entity2vertices.set(againstID, againstVertices);
            }

            if (polygonPolygonCollision(currentVertices, againstVertices)) {
              // TODO: Some way to recieve collision info.
            }
          }
        }
      }
    }
  }
}

export default PolygonCollision;
