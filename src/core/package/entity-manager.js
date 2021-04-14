
/**
 * Manages entities and their attached components.
 *
 * @package
 * @class EntityManager
 */
class EntityManager {
  /**
   * Creates an instance of EntityManager.
   *
   * @memberof EntityManager
   */
  constructor() {
    /** @type {Map<typeof Component, Map<string, Component[]>>} */
    this._componentStorage = new Map();
    /** @type {Map<string, {parent: string, children: string[]}>} */
    this._entityStorage = new Map();
    /** @type {Map<string, string>} */
    this._entity2tag = new Map();
    /** @type {Map<string, string[]>} */
    this._tag2entity = new Map();
  }

  // #region Component

  /**
   * Retrieves the first-attached component of an entity. Returns null if there
   * is none attached.
   *
   * @template {import('../component.js').default} T
   * @param {string} entity
   * @param {new T} component
   * @return {T|null} First-attached component of an entity.
   * @memberof EntityManager
   */
  getComponent(entity, component) {
    return this._componentStorage.get(component)?.get(entity)?.[0] || null;
  }

  /**
   * Retrieves multiple components attached to an entity.
   *
   * @template {import('../component.js').default} T
   * @param {string} entity
   * @param {new T} component
   * @return {T[]} Multiple components attached to an entity.
   * @memberof EntityManager
   */
  getComponents(entity, component) {
    return this._componentStorage.get(component)?.get(entity) || [];
  }

  /**
   * Attaches multiple components to an entity.
   *
   * @param {string} entity
   * @param {...Component} components
   * @return {EntityManager}
   * @memberof EntityManager
   */
  addComponents(entity, ...components) {
    /**
     * @type {Map<typeof Component, {
     *   present: boolean, beggars: Set<typeof Component
     * }>}
     * */
    const requiredComponents = new Map();
    /** @type {Set<typeof Component>} */
    const missingRequiredComponents = new Set();

    while (components.length > 0) {
      const componentInstance = components.shift();
      /** @type {typeof Component} */
      let componentType = componentInstance.constructor;
      componentInstance.ENTITY = entity;
      componentInstance.ENTITY_MANAGER = this;

      while (componentType.name.length > 0) {
        // Associate component/component-parent with [child] instance.
        let storage = this._componentStorage.get(componentType);

        if (!storage) {
          storage = new Map();
          this._componentStorage.set(componentType, storage);
        }

        if (storage.has(entity)) {
          if (componentType.ATTRIBUTES?.SINGLE) {
            throw new Error(
              `Component '${componentType.name}' can only have one instance` +
              ` attached per entity.`,
            );
          }

          storage.get(entity).push(componentInstance);
        } else {
          storage.set(entity, [componentInstance]);
        }

        // Keep track of required components from the target/parent.
        if (componentType.ATTRIBUTES?.REQUIRES) {
          for (const requiredType of componentType.ATTRIBUTES.REQUIRES) {
            if (requiredComponents.has(requiredType)) {
              if (!requiredComponents.get(requiredType).present) {
                requiredComponents.get(requiredType).beggars.add(componentType);
              }
            } else {
              missingRequiredComponents.add(requiredType);
              requiredComponents.set(
                requiredType,
                {'present': false, 'beggars': new Set([componentType])},
              );
            }
          }
        }

        if (requiredComponents.has(componentType)) {
          missingRequiredComponents.delete(componentType);
          requiredComponents.get(componentType).present = true;
        } else {
          requiredComponents.set(
            componentType,
            {'present': true, 'beggars': new Set()},
          );
        }

        // Set focus to component-parent.
        componentType = Reflect.getPrototypeOf(componentType);
      }
    }

    for (const missingComponentType of missingRequiredComponents) {
      const beggars = Array.from(
        requiredComponents.get(missingComponentType).beggars,
      );

      throw new Error(
        `Component ${beggars.length > 1 ? 's' : ''}` +
        beggars.map((value) => '"' + value.name + '"').join(', ') +
        ` requires "${missingComponentType.name}"`,
      );
    }

    return this;
  }

  /**
   * Attaches a component to an entity.
   *
   * @template {import('../component.js').default} T
   * @param {string} entity
   * @param {T} component
   * @return {EntityManager}
   * @memberof EntityManager
   */
  addComponent(entity, component) {
    return this.addComponents(entity, component);
  }

  /**
   * Removes attached components from an entity.
   *
   * @param {...import('../component.js').default} components
   * @return {EntityManager}
   * @memberOf EntityManager
   */
  removeComponents(...components) {
    for (let i = 0; i < components.length; i++) {
      this.removeComponent(components[i]);
    }

    return this;
  }

  /**
   * Removes an attached component from an entity.
   *
   * @template {import('../component.js').default} T
   * @param {T} component
   * @memberof EntityManager
   */
  removeComponent(component) {
    let componentType = component.constructor;

    while (componentType.name.length > 0) {
      const storage = this._componentStorage.get(componentType)
        .get(component.ENTITY);

      storage.splice(
        storage.indexOf(component),
        1,
      );

      componentType = Reflect.getPrototypeOf(componentType);
    }
  }

  /**
   * Removes attached components of the same component type from an entity.
   *
   * @template {import('../component.js').default} T
   * @param {string} entity
   * @param {new T} componentType
   * @return {EntityManager}
   * @memberOf EntityManager
   */
  removeComponentsOfType(entity, componentType) {
    this._componentStorage.get(componentType).set(entity, []);

    let type = Reflect.getPrototypeOf(componentType);
    while (type.name.length > 0) {
      const storage = this._componentStorage.get(type)
        .get(entity);

      this._componentStorage.get(type)
        .set(entity, storage.filter((value) => {
          return !(value instanceof componentType);
        }));

      type = Reflect.getPrototypeOf(type);
    }

    return this;
  }

  // #endregion

  // #region Entity

  /**
   * Creates an entity.
   *
   * @param {string} [tag]
   * @return {string} Identifier representing an entity.
   * @memberof EntityManager
   */
  createEntity(tag='') {
    const entity = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, (c) =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4)
        .toString(16),
    );

    if (tag.length > 0) {
      this._entity2tag.set(entity, tag);

      if (this._tag2entity.has(tag)) {
        this._tag2entity.get(tag).push(entity);
      } else {
        this._tag2entity.set(tag, [entity]);
      }
    }

    return entity;
  }

  /**
   * Destroys an entity as well as its children.
   *
   * @param {string} entity
   * @memberOf EntityManager
   */
  destroyEntity(entity) {
    // Remove associated components.
    for (const storage of this._componentStorage.values()) {
      if (storage.has(entity)) {
        storage.delete(entity);
      }
    }

    // Destroy relationships and children.
    for (const child of this._entityStorage.get(entity).children.values()) {
      this.destroyEntity(child);
    }

    const parent = this.getParentOfEntity(entity);
    if (parent) {
      this.removeChildFromEntity(parent, entity);
    }

    this._entityStorage.delete(entity);

    // Remove associated tag.
    if (this._tag2entity.has(entity) || this._entity2tag.has(entity)) {
      const entities = this._tag2entity.get(this._entity2tag.get(entity));
      entities.splice(
        entities.indexOf(entity),
        1,
      );
      this._entity2tag.delete(entity);
    }

    return this;
  }

  /**
   * Retrieves entities associated with a component.
   *
   * @template {import('../component.js').default} T
   * @param {new T} componentType
   * @return {IterableIterator<string>} Entities associated with a component.
   * @memberof EntityManager
   */
  getEntitiesWithComponentType(componentType) {
    return this._componentStorage.get(componentType)?.keys() || (function* () {
    })();
  }

  // #region Hierarchy

  /**
   * Retrieves the parent of an entity. Returns null if the entity has no
   * parent.
   *
   * @param {string} entity
   * @return {string|null} Parent of an entity.
   * @memberof EntityManager
   */
  getParentOfEntity(entity) {
    return this._entityStorage.get(entity)?.parent || null;
  }

  /**
   * Assigns a new parent for an entity.
   *
   * @param {string} entity
   * @param {string} parent
   * @return {EntityManager}
   * @memberof EntityManager
   */
  setParentOfEntity(entity, parent) {
    const entityStore = this._entityStorage.get(entity);

    if (entityStore) {
      entityStore.parent = parent;
    } else {
      this._entityStorage.set(entity, {parent, children: []});
    }

    const parentStore = this._entityStorage.get(parent);

    if (parentStore) {
      parentStore.children.push(entity);
    } else {
      this._entityStorage.set(parent, {parent: null, children: [entity]});
    }

    return this;
  }

  /**
   * Retrieves the children of an entity.
   *
   * @param {string} entity
   * @return {Iterator<string, number, undefined>} Children of an entity.
   * @memberof EntityManager
   */
  getChildrenOfEntity(entity) {
    const children = this._entityStorage.get(entity).children || [];

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
   * @param {string} entity
   * @param {string} child
   * @return {EntityManager}
   * @memberof EntityManager
   */
  addChildToEntity(entity, child) {
    const entityStore = this._entityStorage.get(entity);

    if (entityStore) {
      entityStore.children.push(child);
    } else {
      this._entityStorage.set(entity, {parent: null, children: [child]});
    }

    const childStore = this._entityStorage.get(child);

    if (childStore) {
      this.removeChildFromEntity(childStore.parent, child);
      childStore.parent = entity;
    } else {
      this._entityStorage.set(child, {parent: entity, children: []});
    }

    return this;
  }

  /**
   * Adds multiple children to an entity.
   *
   * @param {string} entity
   * @param {...string} children
   * @return {EntityManager}
   * @memberof EntityManager
   */
  addChildrenToEntity(entity, ...children) {
    for (const child of children) {
      this.addChildToEntity(entity, child);
    }

    return this;
  }

  /**
   * Removes a child from an entity.
   *
   * @param {string} entity
   * @param {string} child
   * @return {EntityManager}
   * @memberof EntityManager
   */
  removeChildFromEntity(entity, child) {
    const entityStore = this._entityStorage.get(entity);

    if (entityStore) {
      entityStore.children.splice(
        entityStore.children.indexOf(child),
        1,
      );
    }

    const childStore = this._entityStorage.get(child);

    if (childStore) {
      childStore.parent = null;
    }

    return this;
  }

  /**
   * Removes multiple children from an entity.
   *
   * @param {string} entity
   * @param {...string} children
   * @return {EntityManager}
   * @memberof EntityManager
   */
  removeChildrenFromEntity(entity, ...children) {
    for (const child of children) {
      this.removeChildFromEntity(entity, child);
    }

    return this;
  }

  // #endregion

  // #region Tag

  /**
   * Retrieves the first entity associated with a tag.
   *
   * @param {string} tag
   * @return {string|null} First entity associated with a tag.
   * @memberof EntityManager
   */
  getEntityWithTag(tag) {
    return this._tag2entity.get(tag)?.[0] || null;
  }

  /**
   * Retrieves entities associated with a tag.
   *
   * @param {string} tag
   * @return {string[]} Entities associated with a tag.
   * @memberof EntityManager
   */
  getEntitiesWithTag(tag) {
    return this._tag2entity.get(tag) || [];
  }

  /**
   * Retrieves tag associated with an entity.
   *
   * @param {string} entity
   * @return {string} Tag associated with an entity.
   * @memberof EntityManager
   */
  getTagOfEntity(entity) {
    return this._entity2tag.get(entity) || '';
  }

  /**
   * Associates tag with an entity.
   *
   * @param {string} entity
   * @param {string} tag
   * @return {EntityManager}
   * @memberof EntityManager
   */
  setTagOfEntity(entity, tag) {
    this._entity2tag.set(entity, tag);

    if (this._tag2entity.has(tag)) {
      this._tag2entity.get(tag).push(entity);
    } else {
      this._tag2entity.set(tag, [entity]);
    }

    return this;
  }

  // #endregion

  // #endregion
}

export default EntityManager;
