
/**
 * Base class for everything attached to entities.
 *
 * @class Component
 */
class Component {
  /**
   * Creates an instance of Component.
   *
   * @memberof Component
   */
  constructor() {
    /** @type {import('./package/entity-manager.js').default|null} */
    this.ENTITY_MANAGER = null;
    /** @type {string|null} */
    this.ENTITY = null;
  }

  /**
   * Retrieves the components of the parent of the same type.
   *
   * @template {Component} T
   * @static
   * @param {T} target
   * @return {T[]}
   * @memberof Component
   */
  static getParent(target) {
    return target.ENTITY_MANAGER.getComponents(
      target.ENTITY_MANAGER.getParentOfEntity(target.ENTITY),
      target.constructor,
    );
  }

  /**
   * Retrieves the components of each children of the same type.
   *
   * @template {Component} T
   * @static
   * @param {T} target
   * @return {T[][]}
   * @memberof Component
   */
  static getChildren(target) {
    const iterator = target.ENTITY_MANAGER.getChildrenOfEntity(target.ENTITY);
    const children = [];

    let result = iterator.next();
    while (!result.done) {
      children.push(
        target.ENTITY_MANAGER.getComponent(result.value, target.constructor),
      );
      result = iterator.next();
    }

    return children;
  }
}

/**
 * @type {Readonly<{SINGLE: boolean, REQUIRES: (typeof Component)[]}>}
 */
Component.ATTRIBUTES = Object.freeze({
  SINGLE: false,
  REQUIRES: [],
});

export default Component;
