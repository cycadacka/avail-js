import { Constructor } from 'common/types';
import Component, { ComponentType } from './component';

interface IEntityRelationship {
  parent: string | null;
  children: string[];
}

/**
 * Manages entities and their attached components.
 *
 * @class EntityManager
 */
class EntityManager {
  private componentStorage = new Map<ComponentType, Map<string, Component[]>>();
  private entityStorage = new Map<string, IEntityRelationship>();
  private entity2tag = new Map<string, string>();
  private tag2entity = new Map<string, string[]>();

  /**
   * Retrieves the first-attached component of an entity. Returns null if there
   * is none attached.
   *
   * @return First-attached component of an entity.
   * @memberof EntityManager
   */
  getComponent<T extends Component>(entity: string, component: Constructor<T>): T | null {
    return this.componentStorage.get(component)?.get(entity)?.[0] as T ?? null;
  }

  /**
   * Retrieves components attached to an entity.
   *
   * @return Components attached to an entity.
   * @memberof EntityManager
   */
  getComponents<T extends Component>(entity: string, component: Constructor<T>): T[] {
    return this.componentStorage.get(component)?.get(entity) as T[] ?? [];
  }

  /**
   * Attaches multiple components to an entity.
   *
   * @memberof EntityManager
   */
  addComponents(entity: string, ...components: Component[]): void {
    const addedComponents = new Set<ComponentType>();
    const missingComponents = new Set<ComponentType>();

    while (components.length > 0) {
      const component = <Component>components.shift();
      component.onAttach(this, entity);

      let componentType = component.constructor as ComponentType;
      while (componentType.name.length > 0 && <Function>componentType !== Component) {
        if (!addedComponents.has(componentType)) {
          addedComponents.add(componentType);
          missingComponents.delete(componentType);

          // Associate component/component-parent with [child] instance.
          const typeAttributes = (<Component>componentType.prototype).getAttributes();
          let storage = this.componentStorage.get(componentType as ComponentType);

          if (!storage) {
            storage = new Map();
            this.componentStorage.set(componentType, storage);
          }

          if (storage.has(entity)) {
            if (!typeAttributes.allowMultiple) {
              throw new Error(`(${entity}) Component '${componentType.name}' can only have one instance attached per entity.`);
            }
            
            storage.get(entity)!.push(component);
          } else {
            storage.set(entity, [component]);
          }

          // Keep track of required components from the target/parent.
          if (typeAttributes.requiredComponents != undefined) {
            for (let i = 0; i < typeAttributes.requiredComponents.length; i++) {
              const requiredType = <ComponentType>typeAttributes.requiredComponents[i];

              if (!addedComponents.has(requiredType)) {
                missingComponents.add(requiredType);
              }
            }
          }
        }

        // Set focus to component-parent.
        componentType = <ComponentType>Reflect.getPrototypeOf(componentType);
      }
    }

    if (missingComponents.size > 0) {
      let strMissingComponents = '';
      for (const value of missingComponents) {
        if (strMissingComponents.length > 0) {
          strMissingComponents += ', ';
        }

        strMissingComponents += `"${value.name}"`
      }

      throw new Error(
        `(${entity}) Some components are missing from the entity: ${strMissingComponents}.`,
      );
    }
  }

  /**
   * Attaches a component to an entity.
   *
   * @memberof EntityManager
   */
  addComponent<T extends Component>(entity: string, component: T): void {
    return this.addComponents(entity, component);
  }

  /**
   * Removes attached components of the same component type from an entity.
   *
   * @memberof EntityManager
   */
  removeComponents(entity: string, componentType: ComponentType): void {
    let type = componentType as ComponentType;
    while (type.name.length > 0) {
      const store = this.componentStorage.get(type)!;

      if (type === componentType) {
        store.delete(entity);
      } else {
        store.set(entity, store.get(entity)?.filter((value) => {
          return componentType !== (value.constructor as ComponentType);
        }) ?? []);
      }

      type = Reflect.getPrototypeOf(type) as ComponentType;
    }
  }
  
  /**
   * Creates an entity.
   *
   * @return Identifier representing an entity.
   * @memberof EntityManager
   */
  createEntity(tag: string = '', components: Component[] = []) {
    // @ts-expect-error
    const entity = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, (c) =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4)
        .toString(16),
    );

    if (tag.length > 0) {
      this.entity2tag.set(entity, tag);

      if (this.tag2entity.has(tag)) {
        this.tag2entity.get(tag)!.push(entity);
      } else {
        this.tag2entity.set(tag, [entity]);
      }
    }

    this.addComponents(entity, ...components);

    return entity;
  }

  /**
   * Destroys an entity as well as its children.
   *
   * @memberof EntityManager
   */
  destroyEntity(entity: string): void {
    // Remove associated components.
    for (const storage of this.componentStorage.values()) {
      if (storage.has(entity)) {
        storage.delete(entity);
      }
    }

    // Destroy relationships and children.
    if (!this.entityStorage.has(entity)) {
      return;
    }

    for (const child of this.entityStorage.get(entity)!.children.values()) {
      this.destroyEntity(child);
    }

    const parent = this.getParentOfEntity(entity);
    if (parent) {
      this.removeChildFromEntity(parent, entity);
    }

    this.entityStorage.delete(entity);

    // Remove associated tag.
    if (this.tag2entity.has(entity) && this.entity2tag.has(entity)) {
      const entities = this.tag2entity.get(this.entity2tag.get(entity)!)!;
      entities.splice(entities.indexOf(entity), 1);
      this.entity2tag.delete(entity);
    }
  }

  /**
   * Retrieves entities associated with a component.
   *
   * @return Entities associated with a component.
   * @memberof EntityManager
   */
  getEntitiesWithComponent(componentType: ComponentType): string[] {
    const keys = this.componentStorage.get(componentType)?.keys();
    return keys != null ? [...keys] : [];
  }

  /**
   * Retrieves the parent of an entity. Returns null if the entity has no
   * parent.
   *
   * @return Parent of an entity.
   * @memberof EntityManager
   */
  getParentOfEntity(entity: string): string | null {
    return this.entityStorage.get(entity)?.parent || null;
  }

  /**
   * Assigns a new parent for an entity.
   *
   * @memberof EntityManager
   */
  setParentOfEntity(entity: string, parent: string): EntityManager {
    const entityStore = this.entityStorage.get(entity);

    if (entityStore) {
      entityStore.parent = parent;
    } else {
      this.entityStorage.set(entity, {parent, children: []});
    }

    const parentStore = this.entityStorage.get(parent);

    if (parentStore) {
      parentStore.children.push(entity);
    } else {
      this.entityStorage.set(parent, { parent: null, children: [entity] });
    }

    return this;
  }

  /**
   * Retrieves the children of an entity.
   *
   * @return Children of an entity.
   * @memberof EntityManager
   */
  getChildrenOfEntity(entity: string): Generator<string, number, void> {
    const children = this.entityStorage.get(entity)?.children ?? [];

    return (function* () {
      for (let i = 0; i < children.length; i++) {
        yield children[i];
      }

      return children.length;
    })();
  }

  /**
   * Adds a child to an entity.
   *
   * @memberof EntityManager
   */
  addChildToEntity(entity: string, child: string): EntityManager {
    const entityStore = this.entityStorage.get(entity);

    if (entityStore) {
      entityStore.children.push(child);
    } else {
      this.entityStorage.set(entity, {parent: null, children: [child]});
    }

    const childStore = this.entityStorage.get(child);

    if (childStore != null) {
      if (childStore.parent != null) {
        this.removeChildFromEntity(childStore.parent, child);
      }
  
      childStore.parent = entity;
    } else {
      this.entityStorage.set(child, { parent: entity, children: [] });
    }

    return this;
  }

  /**
   * Adds multiple children to an entity.
   *
   * @memberof EntityManager
   */
  addChildrenToEntity(entity: string, ...children: string[]): EntityManager {
    for (const child of children) {
      this.addChildToEntity(entity, child);
    }

    return this;
  }

  /**
   * Removes a child from an entity.
   *
   * @memberof EntityManager
   */
  removeChildFromEntity(entity: string, child: string): EntityManager {
    const entityStore = this.entityStorage.get(entity);

    if (entityStore) {
      entityStore.children.splice(
        entityStore.children.indexOf(child),
        1,
      );
    }

    const childStore = this.entityStorage.get(child);

    if (childStore) {
      childStore.parent = null;
    }

    return this;
  }

  /**
   * Removes multiple children from an entity.
   *
   * @memberof EntityManager
   */
  removeChildrenFromEntity(entity: string, ...children: string[]): EntityManager {
    for (const child of children) {
      this.removeChildFromEntity(entity, child);
    }

    return this;
  }

  /**
   * Retrieves the first entity associated with a tag.
   *
   * @return First entity associated with a tag.
   * @memberof EntityManager
   */
  getEntityWithTag(tag: string): string | null {
    return this.tag2entity.get(tag)?.[0] || null;
  }

  /**
   * Retrieves entities associated with a tag.
   *
   * @return Entities associated with a tag.
   * @memberof EntityManager
   */
  getEntitiesWithTag(tag: string): string[] {
    return this.tag2entity.get(tag) || [];
  }

  /**
   * Retrieves tag associated with an entity.
   *
   * @return Tag associated with an entity.
   * @memberof EntityManager
   */
  getTagOfEntity(entity: string): string | null {
    return this.entity2tag.get(entity) || null;
  }

  /**
   * Associates tag with an entity.
   *
   * @memberof EntityManager
   */
  setTagOfEntity(entity: string, tag: string): EntityManager {
    this.entity2tag.set(entity, tag);

    if (this.tag2entity.has(tag)) {
      this.tag2entity.get(tag)!.push(entity);
    } else {
      this.tag2entity.set(tag, [entity]);
    }

    return this;
  }

}

export default EntityManager;
