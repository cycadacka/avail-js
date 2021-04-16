import PolygonCollider from '../../components/collision/polygon-collider.js';
import Polygon from '../../components/shapes/polygon.js';
import Transform from '../../components/transform.js';
import {getAABB} from './package/get-aabb.js';
import {
  rectangleRectangleCollision,
  polygonPolygonCollision,
} from './package/collision.js';
import Vector2D from '../../math/vector2d.js';

/**
 * Retrieves the reconstructed OBB with proper minimum and maximum bounds.
 *
 * @ignore
 * @param {{min: Vector2D, max: Vector2D}} obb
 * @param {Transform} transform
 * @return {{min: Vector2D, max: Vector2D}}
 */
function reconstructOBB(obb, transform) {
  // Reconstruct box
  const box = [
    obb.min,
    new Vector2D(obb.min.x, obb.max.y),
    obb.max,
    new Vector2D(obb.max.x, obb.min.y),
  ];

  // Transform reconstructed box
  const matrix = transform.localToWorldMatrix;
  const min = new Vector2D(Infinity, Infinity);
  const max = new Vector2D(-Infinity, -Infinity);

  for (let i = 0; i < 4; i++) {
    const vertex = matrix.multiplyVector2(box[i]);

    if (vertex.x < min.x) {
      min.x = vertex.x;
    }

    if (vertex.x > max.x) {
      max.x = vertex.x;
    }

    if (vertex.y < min.y) {
      min.y = vertex.y;
    }

    if (vertex.y > max.y) {
      max.y = vertex.y;
    }
  }

  return {min, max};
}

/**
 * Handles collision between shapes.
 *
 * @class PolygonCollision
 */
class PolygonCollision {
  /**
   * Creates an instance of PolygonCollision.
   *
   * @param {HTMLCanvasElement} canvas
   * @memberof PolygonCollision
   */
  constructor(canvas) {
    this._context = canvas.getContext('2d');
    /**
     * @type {Map<string, {min: Vector2D, max: Vector2D}>}
     */
    this._entity2obb = new Map();
  }

  /**
   * Constructs the entity and retrieves the needed components and
   * object-aligned bounding boxes.
   *
   * @private
   * @param {string} entity
   * @param {import(
   *   '../../core/package/entity-manager.js'
   * ).default} entityManager
   * @param {Map<string, {min: Vector2D, max: Vector2D}>} entity2aabb
   * @return {{
   *   components: {
   *     collider: PolygonCollider,
   *     transform: Transform,
   *     polygon: Polygon,
   *   },
   *   obb: {
   *     min: Vector2D,
   *     max: Vector2D,
   *   },
   *   aabb: {
   *     min: Vector2D,
   *     max: Vector2D,
   *   },
   * }}
   * @memberof PolygonCollision
   */
  _constructEntity(entity, entityManager, entity2aabb) {
    const components = {
      collider: entityManager.getComponent(entity, PolygonCollider),
      transform: entityManager.getComponent(entity, Transform),
      polygon: entityManager.getComponent(entity, Polygon),
    };

    const obb = this._entity2obb.get(entity) || components.polygon.obb;
    if (!this._entity2obb.has(entity)) {
      this._entity2obb.set(entity, obb);
    }

    let aabb = entity2aabb.get(entity);
    if (!aabb) {
      aabb = getAABB(
        reconstructOBB(obb, components.transform, entity2aabb),
      );
      entity2aabb.set(entity, aabb);
    }

    return {components, obb, aabb};
  }

  /**
   * Callback called every fixed frame.
   *
   * @param {{deltaTime: number, time: number}} time
   * @param {import(
   *   '../../core/package/entity-manager.js'
   * ).default} entityManager
   * @memberof PolygonCollision
   */
  fixedUpdate(time, entityManager) {
    const entities = entityManager.getEntitiesWithComponentType(
      PolygonCollider,
    );
    /** @type {Map<string, {min: Vector2D, max: Vector2D}>} */
    const entity2aabb = new Map();
    /** @type {Map<string, Vector2D[]>} */
    const entity2vertices = new Map();

    for (const currentID of entities) {
      const current = this._constructEntity(
        currentID, entityManager, entity2aabb,
      );

      for (const againstID of entities) {
        if (currentID !== againstID) {
          const against = this._constructEntity(
            againstID, entityManager, entity2aabb,
          );

          if (rectangleRectangleCollision(
            current.aabb.min, current.aabb.max,
            against.aabb.min, against.aabb.max,
          )) {
            current.components.collider.broadCollided = true;

            // Polygon to Polygon Collision
            const currentMatrix = (
              current.components.transform.localToWorldMatrix
            );
            let currentVertices = entity2vertices.get(currentID);
            if (!currentVertices) {
              currentVertices = current.components.polygon.vertices
                .map((value) => currentMatrix.multiplyVector2(value));
              entity2vertices.set(currentID, currentVertices);
            }

            const againstMatrix = (
              against.components.transform.localToWorldMatrix
            );
            let againstVertices = entity2vertices.get(againstID);
            if (!againstVertices) {
              againstVertices = against.components.polygon.vertices
                .map((value) => againstMatrix.multiplyVector2(value));
              entity2vertices.set(againstID, againstVertices);
            }

            if (polygonPolygonCollision(currentVertices, againstVertices)) {
              current.components.collider.narrowCollided = true;
            }
          }
        }
      }
    }
  }
}

export default PolygonCollision;
