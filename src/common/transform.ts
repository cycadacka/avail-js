import Vector2D from 'math/vector2d';
import Matrix3x3 from 'math/matrix3x3';
import Component, { ComponentType } from 'core/component';
import EntityManager from 'core/entity-manager';

/**
 * Position, rotation and scale of an entity.
 *
 * @class Transform
 */
class Transform extends Component {
  public localPosition: Vector2D;
  public localRotation: number;
  public localScale: Vector2D;

  private entityManager: EntityManager | null = null;
  private entity: string | null = null;

  constructor(
    localPosition: [number, number] = [0, 0],
    localRotation: number = 0,
    localScale: [number, number] = [1, 1],
  ) {
    super();

    this.localPosition = new Vector2D(localPosition[0], localPosition[1]);
    this.localRotation = localRotation;
    this.localScale = new Vector2D(localScale[0], localScale[1]);
  }

  onAttach(entityManager: EntityManager, entity: string): void {
    this.entityManager = entityManager;
    this.entity = entity;
  }

  get attributes() {
    return {
      single: true,
      requires: <ComponentType[]>[],
    };
  }

  /**
   * Position of an entity.
   *
   * @memberof Transform
   */
  get position(): Vector2D {
    const parent = this.parent;
    return new Proxy(this.localPosition, {
      get(target, p: 'x' | 'y') {
        return (parent?.localToWorldMatrix.multiplyVector2(target) ?? target)[p];
      },
      set(target, p, value) {
        switch (p) {
        case 'x':
          target.x = parent?.localToWorldMatrix
            .multiplyVector2(new Vector2D(value, 0)).x ?? value;
          break;
        case 'y':
          target.y = parent?.localToWorldMatrix
            .multiplyVector2(new Vector2D(0, value)).y ?? value;
          break;
        }

        return true;
      },
    });
  }

  /**
   * Position of an entity.
   *
   * @memberof Transform
   */
  set position(value: Vector2D) {
    const localValue = this.parent ? this.worldToLocalMatrix.multiplyVector2(value) : value;

    this.localPosition.x = localValue.x;
    this.localPosition.y = localValue.y;
  }

  /**
   * Rotation of an entity.
   *
   * @memberof Transform
   */
  get rotation(): number {
    return this.localRotation + (this.parent?.rotation || 0);
  }

  /**
   * Rotation of an entity.
   *
   * @memberof Transform
   */
  set rotation(value: number) {
    this.localRotation = value - (this.parent?.rotation || 0);
  }

  /**
   * Scale of an entity.
   *
   * @memberof Transform
   */
  get scale(): Vector2D {
    const self = this;

    return new Proxy(this.localScale, {
      get(target, p: 'x' | 'y') {
        return Vector2D.scale((self.parent?.scale || Vector2D.one), target)[p];
      },
      set(target, p, value) {
        switch (p) {
        case 'x':
          target.x = value / (self.parent?.scale.x || 1);
          break;
        case 'y':
          target.y = value / (self.parent?.scale.y || 1);
          break;
        }

        return true;
      },
    });
  }

  /**
   * Scale of an entity.
   *
   * @memberof Transform
   */
  set scale(value: Vector2D) {
    const offset = this.parent?.scale || Vector2D.one;

    this.localScale.x = value.x / offset.x;
    this.localScale.y = value.y / offset.y;
  }

  /**
   * Matrix that transforms a point from local space into world space.
   *
   * @readonly
   * @memberof Transform
   */
  get localToWorldMatrix(): Matrix3x3 {
    return Matrix3x3.createTRS(this.position, this.rotation, this.scale);
  }

  /**
   * Matrix that transforms a point from world space into local space.
   *
   * @readonly
   * @memberof Transform
   */
  get worldToLocalMatrix(): Matrix3x3 {
    return this.localToWorldMatrix.inverse;
  }

  private get parent(): Transform | null {
    if (this.entityManager != null && this.entity != null) {
      return Component.getParent<Transform>(this.entityManager, this.entity)[0]
    } else {
      return null;
    }
  }
}

export default Transform;
