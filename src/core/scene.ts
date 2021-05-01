import EntityManager from './entity-manager';
import System from './system';
import { TimeImplementation } from './time';

/**
 * Represents the entities.
 *
 * @export
 * @class Scene
 */
class Scene {
  protected systems: System[];
  protected framing = {
    update: 0,
  };

  private _time: TimeImplementation;
  private _entityManager: EntityManager;

  /**
   * Creates an instance of Scene.
   *
   * @memberof Scene
   */
  constructor(systems: System[] = [], fixedDeltaTime: number = 0.02, targetFrameRate: number = 60) {
    this.systems = systems;
    this.framing.update = 1 / targetFrameRate;

    this._time = new TimeImplementation(fixedDeltaTime);
    this._entityManager = new EntityManager();
  }

  get entityManager(): EntityManager {
    return this._entityManager;
  }

  /**
   * Starts the scene.
   *
   * @memberof Scene
   */
  start() {
    for (const system of this.systems) {
      system.start?.({
        time: this._time,
        entityManager: this._entityManager,
      });
    }

    this._time._time = performance.now() * 1000;
    requestAnimationFrame(this.update.bind(this, performance.now()));
  }

  /**
   * Function called every update.
   *
   * @memberof Scene
   */
  private update(time: DOMHighResTimeStamp):void {
    const timeSeconds = time * 1000;

    while (this._time._fixedTime < timeSeconds) {
      for (const system of this.systems) {
        system.fixedUpdate?.({
          time: this._time,
          entityManager: this._entityManager,
        });
      }

      this._time._fixedTime += this._time.fixedDeltaTime;
    }

    const deltaTime = timeSeconds - this._time._time;
    if (deltaTime > this.framing.update) {
      for (const system of this.systems) {
        system.update?.({
          time: this._time,
          entityManager: this._entityManager,
        });
      }

      this._time._time = timeSeconds - (deltaTime % this.framing.update);
    }

    requestAnimationFrame(this.update.bind(this));
  }
}

export default Scene;