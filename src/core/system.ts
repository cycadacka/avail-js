import EntityManager from './entity-manager';
import { Time } from './time';
import Component from './component';

export interface SceneInfo {
  time: Time;
  entityManager: EntityManager;
}

interface SystemStatic {
  new(): System;
  attributes: Readonly<{
    main: Component;
    secondary: Component[];
  }>;
} 

/**
 * Represents the system-part of the entity-component-system.
 *
 * @abstract
 * @class System
 */
abstract class System {
  public static implement() {
    return <U extends SystemStatic>(constructor: U) => constructor;
  }

  /**
   * Function called when a scene is started.
   *
   * @virtual
   * @param info
   * @memberof System
   */
  public abstract start?(info: SceneInfo): void;

  /**
   * Function called every frame (with the given `targetFrameRate`).
   *
   * @virtual
   * @param info
   * @memberof System
   */
  public abstract update?(info: SceneInfo): void;

  /**
   * Function called every fixed-time (according to `fixedDeltaTime`).
   *
   * @virtual
   * @param info
   * @memberof System
   */
  public abstract fixedUpdate?(info: SceneInfo): void;
}

export default System;
