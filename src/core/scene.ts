import EntityManager from './entity-manager';
import System from './system';

/**
 * Represents the entities.
 *
 * @export
 * @class Scene
 */
class Scene {
  protected systems = {
    start: <System[]>[],
    fixedUpdate: <System[]>[],
    update: <System[]>[],
  };

  protected framing = {
    targetDeltaTime: 0,
  };

  private _time = {
    fixedDeltaTime: 0,
    fixedTime: 0,
    deltaTime: 0,
    time: 0,
  };
  private _entityManager: EntityManager;

  /**
   * Creates an instance of Scene.
   *
   * @memberof Scene
   */
  constructor(systems: System[] = [], fixedDeltaTime: number = (1 / 50), targetFrameRate: number = 60) {
    for (let i = 0; i < systems.length; i++) {
      const system = systems[i];
      if (system.start) {
        this.systems.start.push(system);
      }

      if (system.fixedUpdate) {
        this.systems.fixedUpdate.push(system);
      }

      if (system.update) {
        this.systems.update.push(system);
      }
    }
    this.framing.targetDeltaTime = 1 / targetFrameRate;

    this._time.fixedDeltaTime = fixedDeltaTime;
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
    for (const system of this.systems.start) {
      system.start!({
        time: this._time,
        entityManager: this._entityManager,
      });
    }

    this._time.time = performance.now() / 1000;
    this._time.fixedTime = this._time.time;
    this.update(this._time.time * 1000);
  }

  /**
   * Function called every update.
   *
   * @memberof Scene
   */
  private update(time: DOMHighResTimeStamp):void {
    const timeSeconds = time / 1000;
    this._time.deltaTime = timeSeconds - this._time.time;

    if (this._time.deltaTime > this.framing.targetDeltaTime) {
      this._time.time = timeSeconds - (this._time.deltaTime % this.framing.targetDeltaTime);

      for (const system of this.systems.update) {
        system.update!({
          time: this._time,
          entityManager: this._entityManager,
        });
      }
    }

    while (this._time.fixedTime < this._time.time) {
      this._time.fixedTime += this._time.fixedDeltaTime;

      for (const system of this.systems.fixedUpdate) {
        system.fixedUpdate!({
          time: this._time,
          entityManager: this._entityManager,
        });
      }
    }

    requestAnimationFrame(this.update.bind(this));
  }
}

export default Scene;