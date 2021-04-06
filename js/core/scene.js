import EntityManager from './package/entity-manager.js';
import System from './system.js';

class Scene {
  #entityManager = new EntityManager();
  
  /** @type {number} */
  #FIXED_DELTA_TIME;
  #fixedTime = 0;

  /** @type {number} */
  #VARIABLE_FPS_LIMIT;
  #time = 0;

  /** @type {System[]} */
  #systems = [];

  /**
   * Creates an instance of Scene.
   * 
   * @param {System[]} systems 
   * @param {number} fixedFpsLimit 
   * @param {number} variableFpsLimit 
   * 
   * @memberOf Scene
   */
  constructor(systems=[], fixedFpsLimit=50, variableFpsLimit=60)  {
    this.#FIXED_DELTA_TIME = (1000/fixedFpsLimit);
    this.#VARIABLE_FPS_LIMIT = variableFpsLimit;
    
    this.#systems = systems;
  }

  /** 
   * @memberOf Scene
   */
  start() {
    for (const system of this.#systems) {
      system.start?.(this);
    }

    this.#time = performance.now();
    requestAnimationFrame(this.#update.bind(this), performance.now());
  }

  /**
   * @private
   * @param {number} time 
   * 
   * @memberof Scene
   */
  #update(time) {
    // Fixed timestep
    while (this.#fixedTime < time) {
      for (const system of this.#systems) {
        system.fixedUpdate?.(Object.freeze({
          time: this.#fixedTime,
          deltaTime: this.#FIXED_DELTA_TIME,
        }), this.#entityManager);
      }

      this.#fixedTime += this.#FIXED_DELTA_TIME;
    }

    // Variable timestep
    const deltaTime = time - this.#time;
    if (1000 / deltaTime <= this.#VARIABLE_FPS_LIMIT) {
      for (const system of this.#systems) {
        system.update?.(Object.freeze({
          time,
          deltaTime,
        }), this.#entityManager);
      }

      this.#time = time;
    }

    requestAnimationFrame(this.#update.bind(this));
  }

  get entityManager() {
    return this.#entityManager;
  }
}

export default Scene;
