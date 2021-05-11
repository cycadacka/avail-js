import System from "core/types";
import PolygonCollision from "../collision/polygon-collision";
import { SystemInfo } from "../core/types";
import RigidBody from "./rigid-body";
import PolygonCollider from "../collision/polygon-collider";
import Transform from "common/transform";
import Polygon from "shapes/polygon";
import EntityManager from "core/entity-manager";

interface Entity {
  components: {
    polygonCollider: PolygonCollider;
    transform: Transform;
    rigidBody: RigidBody;
    polygon: Polygon;
  };
}

class RigidBodyPhysics implements System {
  private polygonCollision: PolygonCollision;

  constructor(polygonCollision: PolygonCollision) {
    this.polygonCollision = polygonCollision;
  }

  start({ entityManager }: SystemInfo) {
    const entities = entityManager.getEntitiesWithComponent(RigidBody);

    for (const entity of entities) {
      this.constructEntity(entity, entityManager);
    }
  }

  private constructEntity(
    entity: string,
    entityManager: EntityManager
  ): Entity | null {
    const components = {
      polygonCollider: entityManager.getComponent(entity, PolygonCollider),
      transform: entityManager.getComponent(entity, Transform),
      rigidBody: entityManager.getComponent(entity, RigidBody),
      polygon: entityManager.getComponent(entity, Polygon),
    };

    if (
      !(
        components.polygonCollider &&
        components.transform &&
        components.rigidBody &&
        components.polygon
      )
    ) {
      return null;
    }

    return <Entity>{
      components,
    };
  }
}

export default RigidBodyPhysics;
