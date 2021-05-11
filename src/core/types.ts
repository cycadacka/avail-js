import EntityManager from 'core/entity-manager';

export interface SystemInfo {
  time: {
    readonly fixedDeltaTime: number,
    readonly fixedTime: number;
    readonly deltaTime: number,
    readonly time: number,
  };
  entityManager: EntityManager;
}

/**
 * Represents the system-part of the entity-component-system.
 *
 * @interface System
 */
export default interface System {
  /**
   * Function called when a scene is started.
   *
   * @memberof System
   */
  start?(info: SystemInfo): void;

  /**
   * Function called every frame (with the given `targetFrameRate`).
   *
   * @memberof System
   */
  update?(info: SystemInfo): void;

  /**
   * Function called every fixed-time (according to `fixedDeltaTime`).
   * 
   * @memberof System
   */
  fixedUpdate?(info: SystemInfo): void;
}
