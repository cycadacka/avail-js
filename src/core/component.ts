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
  static getParent<T extends Component>(entityManager: EntityManager, entity: string, component: Constructor<T>): T[] {
    const parent = entityManager.getParentOfEntity(entity);
    return entityManager.getComponents(
      parent!,
      component,
    );
  }
}
