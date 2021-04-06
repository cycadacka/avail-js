import EntityManager from "./package/entity-manager.js";

/**
 *
 * @static
 * @class Component
 */
class Component {
  /**
   * Universal attributes for all components.
   *
   * @static
   * @type {{SINGLE: boolean, REQUIRES: Component[]}}
   *
   * @memberOf Component
   */
  static ATTRIBUTES = Object.freeze({
    SINGLE: false,
    REQUIRES: [],
  });

  constructor() {
    throw new Error('Component cannot be constructed');
  }

  /**
   * Retrieves the components of the parent of the same type.
   *
   * @static
   * @param {{
   *   ENTITY_MANAGER: import('./package/entity-manager.js').default,
   *   ENTITY: string
   * }} target
   * @return {Component[]}
   * @memberof Component
   */
  static parent(target) {
    return target.ENTITY_MANAGER.getComponents(
      target.ENTITY_MANAGER.getParentOfEntity(target.ENTITY),
      target.constructor,
    );
  }

  /**
   * Retrieves the components of each children of the same type.
   *
   * @static
   * @param {{
   *   ENTITY_MANAGER: import('./package/entity-manager.js').default,
   *   ENTITY: string
   * }} target
   * @return {Component[][]} 
   * @memberof Component
   */
  static children(target) {
    const iterator = target.ENTITY_MANAGER.getChildrenOfEntity(target.ENTITY);
    const children = [];

    const result = iterator.next();
    while (!result.done) {
      children.push(
        target.ENTITY_MANAGER.getComponent(result.value, target.constructor),
      );
      result = iterator.next();
    }

    return children;
  }

  /**
   * Translates the component into a format that can be stored and
   * reconstructed later.
   *
   * @virtual
   * @param {object} target
   * @return {string}
   *
   * @memberOf Component
   */
  static serialize(target) {
    return JSON.stringify(target);
  }

  /**
   * Recontructs the stored format into a usable component.
   *
   * @virtual
   * @param {string} data
   * @return {object}
   *
   * @memberOf Component
   */
  static deserialize(data) {
    const component = new this.constructor();

    const object = JSON.parse(data);
    for (const key in object) {
      if (Object.hasOwnProperty.call(object, key)) {
        result[key] = object[key];
      }
    }

    return component;
  }

  /**
   * @param {Component} component
   * @return {boolean}
   *
   * @memberOf Component
   */
  isComponent(component) {
    const prototype = Reflect.getPrototypeOf(component);

    if (prototype === System) {
      return true;
    } else if (prototype.name.length <= 0) { // anonymous()
      return false;
    } else {
      return this.isComponent(prototype);
    }
  }
}

export default Component;
