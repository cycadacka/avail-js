
/**
 * @export
 * @interface Time
 */
export interface Time {
  fixedDeltaTime: number;
  readonly fixedTime: number;
  readonly deltaTime: number;
  readonly time: number;
}

/**
 * @export
 * @class TimeImpl
 * @implements {Time}
 */
export class TimeImplementation implements Time {
  public fixedDeltaTime: number;
  public _fixedTime: number;
  public _deltaTime: number;
  public _time: number;

  constructor(fixedDeltaTime: number) {
    this.fixedDeltaTime = fixedDeltaTime;
    this._fixedTime = 0;
    this._deltaTime = 0;
    this._time = 0;
  }

  get fixedTime() {
    return this._fixedTime;
  }

  get deltaTime() {
    return this._deltaTime;
  }

  get time() {
    return this._time;
  }
}
