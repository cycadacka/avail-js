import EntityManager from './entity-manager';
import { Constructor } from 'common/types';

export type ComponentType = Constructor<Component>;

interface IComponentAttributes {
  readonly allowMultiple: boolean;
  readonly requiredComponents?: ComponentType[];
}

/**
 * Base class for everything attached to entities.
 *
 * @class Component
 */
export default abstract class Component {
  getAttributes(): IComponentAttributes {
    return {
      allowMultiple: true,
      requiredComponents: [],
    };
  }

  /**
   * Retrieves the components of the parent of the same type.
   *
   * @static
   * @memberof Component
   */
  static getParent<T extends Component>(entityManager: EntityManager, entity: string): T[] {
    return entityManager.getComponents(
      entityManager.getParentOfEntity(entity) ?? "",
      this.constructor as Constructor<T>,
    );
  }

  /**
   * Retrieves the components of each children of the same type.
   *
   * @static
   * @memberof Component
   */
  static getChildren<T extends Component>(entityManager: EntityManager, entity: string): T[][] {
    const iterator = entityManager.getChildrenOfEntity(entity);
    const children: T[][] = [];

    let result = iterator.next();
    while (!result.done) {
      children.push(
        entityManager.getComponents(
          entity,
          this.constructor as Constructor<T>,
        ),
      );
      result = iterator.next();
    }

    return children;
  }
}
