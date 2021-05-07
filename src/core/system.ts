import EntityManager from './entity-manager';
import { Time } from './time';

export interface SceneInfo {
  time: Time;
  entityManager: EntityManager;
}

/**
 * Represents the system-part of the entity-component-system.
 *
 * @interface System
 */
interface System {
  /**
   * Function called when a scene is started.
   *
   * @memberof System
   */
  start?(info: SceneInfo): void;

  /**
   * Function called every frame (with the given `targetFrameRate`).
   *
   * @memberof System
   */
  update?(info: SceneInfo): void;

  /**
   * Function called every fixed-time (according to `fixedDeltaTime`).
   * 
   * @memberof System
   */
  fixedUpdate?(info: SceneInfo): void;
}

export default System;
