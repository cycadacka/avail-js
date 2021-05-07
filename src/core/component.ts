import EntityManager from './entity-manager';
import { ClassConstructor } from 'types';

export type ComponentType = ClassConstructor<Component>;

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

  onAttach(entityManager: EntityManager, entity: string): void { }

  /**
   * Retrieves the components of the parent of the same type.
   *
   * @static
   * @memberof Component
   */
  static getParent<T extends Component>(entityManager: EntityManager, entity: string): T[] {
    return entityManager.getComponents(
      entityManager.getParentOfEntity(entity) ?? "",
      this.constructor as ClassConstructor<T>,
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
          this.constructor as ClassConstructor<T>,
        ),
      );
      result = iterator.next();
    }

    return children;
  }
}
