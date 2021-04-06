import EntityManager from "./package/entity-manager.js";

/**
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
    /** @type {string|null} */
    this.ENTITY = null;
    /** @type {EntityManager|null} */
    this.ENTITY_MANAGER = null;
  }

  /**
   * First component of the parent of the same type.
   *
   * @readonly
   * @return {Component|null}
   *
   * @memberOf Component
   */
  get _parent() {
    return this.ENTITY_MANAGER.getComponent(
      this.ENTITY_MANAGER.getParentOfEntity(this.ENTITY),
      this.constructor,
    );
  }

  /**
   * First component of each children of the same type.
   *
   * @readonly
   * @return {Component[]}
   *
   * @memberOf Component
   */
  get _children() {
    const iterator = this.ENTITY_MANAGER.getChildrenOfEntity(this.ENTITY);
    const children = [];

    const result = iterator.next();
    while (!result.done) {
      children.push(
        this.ENTITY_MANAGER.getComponent(result.value, this.constructor),
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
   * @return {string}
   *
   * @memberOf Component
   */
  serialize() {
    return JSON.stringify(this);
  }

  /**
   * Recontructs the stored format into a usable component.
   *
   * @virtual
   * @param {string} data
   * @return {Component}
   *
   * @memberOf Component
   */
  static deserialize(data) {
    const component = new (this.constructor)();

    const object = JSON.parse(data);
    for (const key in object) {
      if (Object.hasOwnProperty.call(object, key)) {
        const element = object[key];
        result[key] = element;
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
    } else if (prototype.name.length <= 0) {
      // anonymous()
      return false;
    } else {
      return this.isComponent(prototype);
    }
  }
}

export default Component;
