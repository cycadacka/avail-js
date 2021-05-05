import PolygonCollider from './polygon-collider';
import Polygon from './polygon';
import { BoundingBox } from 'types';
import {
  aabb as aabbUtil,
  rectangleRectangleCollision,
  polygonPolygonCollision,
} from './util/collision';
import Transform from 'modules/transform';
import Vector2D from 'math/vector2d';
import EntityManager from 'core/entity-manager';
import System, { SceneInfo } from 'core/system';

interface PolygonCollisionEntity {
  components: [PolygonCollider[], Polygon[], Transform[]];
  obb: BoundingBox;
  aabb: BoundingBox;
}

/**
 * Handles collision between shapes.
 *
 * @class PolygonCollision
 */
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
  private constructEntity(
    entity: string,
    entityManager: EntityManager, 
    entity2aabb: Map<string, BoundingBox>
  ): PolygonCollisionEntity {
    // Get components.
    const components = (
      <[PolygonCollider[], Polygon[], Transform[]]>
      entityManager.getMultipleComponents(entity, PolygonCollider, Polygon, Transform)
    );

    // Get object-aligned bounding-box
    const obb = this.entity2obb.get(entity) ?? components[1][0].obb;
    if (!this.entity2obb.has(entity)) {
      this.entity2obb.set(entity, obb);
    }

    // Get axis-aligned bounding-box
    let aabb = entity2aabb.get(entity)!;
    if (!aabb) {
      aabb = aabbUtil(obb, components[2][0]);
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
      const current = this.constructEntity(
        currentID,
        entityManager,
        entity2aabb,
      );

      for (const againstID of entities) {
        if (currentID !== againstID) {
          const against = this.constructEntity(
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
              current.components[2][0].localToWorldMatrix
            );
            let currentVertices = entity2vertices.get(currentID);
            if (!currentVertices) {
              currentVertices = current.components[1][0].vertices.map(
                value => currentMatrix.multiplyVector2(value),
              );
              entity2vertices.set(currentID, currentVertices);
            }

            const againstMatrix = (
              against.components[2][0].localToWorldMatrix
            );
            let againstVertices = entity2vertices.get(againstID);
            if (!againstVertices) {
              againstVertices = against.components[1][0].vertices.map(
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
