import EntityManager from './package/entity-manager.js';

class System {
  constructor() {
  }

  /**
   * Function called when the game starts.
   *
   * @memberOf System
   */
  start() {
  }

  /**
   * Function called at variable timesteps.
   * 
   * @param {{time: number, deltaTime: number}} time 
   * @param {EntityManager} scene 
   * 
   * @memberOf System
   */
  update(time, scene) {
  }

  /**
   * Function called at fixed timesteps.
   * 
   * @param {{time: number, deltaTime: number}} time 
   * @param {EntityManager} scene 
   * 
   * @memberOf System
   */
  fixedUpdate(time, scene) {
  }


  /**
   * Checks if it extends from System.
   * 
   * @static
   * @param {System} system 
   * @returns {boolean}
   * 
   * @memberOf System
   */
  static isSystem(system) {
    const prototype = Reflect.getPrototypeOf(system);

    if (prototype === System) {
      return true;
    } else if (prototype.name.length <= 0) { // anonymous()
      return false;
    } else {
      return this.isSystem(prototype);
    }
  }
}

export default System;
