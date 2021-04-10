import EntityManager from './package/entity-manager.js';

/**
 * @callback startCallback
 * @param {EntityManager} entityManager
 * @return {void}
 */

/**
 * @callback updateCallback
 * @param {{time: number, deltaTime: number}} time
 * @param {EntityManager} entityManager
 * @return {void}
 */

/**
 * @callback fixedUpdateCallback
 * @param {{time: number, deltaTime: number}} time
 * @param {EntityManager} entityManager
 * @return {void}
 */

/**
 * @typedef System
 * @property {startCallback} start
 * @property {updateCallback} update
 * @property {fixedUpdateCallback} fixedUpdate
 */

/**
 * Represents the entities.
 *
 * @class Scene
 */
class Scene {
  /**
   * Creates an instance of Scene.
   *
   * @param {System[]} systems
   * @param {number} fixedFpsLimit
   * @param {number} variableFpsLimit
   * @memberOf Scene
   */
  constructor(systems=[], fixedFpsLimit=50, variableFpsLimit=60) {
    this.entityManager = new EntityManager();

    this._FIXED_DELTA_TIME = (1000/fixedFpsLimit);
    this._fixedTime = 0;

    this._VARIABLE_FPS_LIMIT = variableFpsLimit;
    this._time = 0;

    this._systems = systems;
  }

  /**
   * Starts the scene.
   *
   * @memberOf Scene
   */
  start() {
    for (const system of this._systems) {
      system.start?.(this.entityManager);
    }

    this._time = performance.now();
    requestAnimationFrame(this._update.bind(this), performance.now());
  }

  /**
   * @ignore
   * @param {number} time
   * @memberof Scene
   */
  _update(time) {
    // Fixed timestep
    while (this._fixedTime < time) {
      for (const system of this._systems) {
        system.fixedUpdate?.(Object.freeze({
          time: this._fixedTime,
          deltaTime: this._FIXED_DELTA_TIME / 1000,
        }), this.entityManager);
      }

      this._fixedTime += this._FIXED_DELTA_TIME;
    }

    // Variable timestep
    const deltaTime = time - this._time;
    if (1000 / deltaTime <= this._VARIABLE_FPS_LIMIT) {
      for (const system of this._systems) {
        system.update?.(Object.freeze({
          time,
          deltaTime: deltaTime / 1000,
        }), this.entityManager);
      }

      this._time = time;
    }

    requestAnimationFrame(this._update.bind(this));
  }
}

export default Scene;
