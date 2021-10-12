import { Constructor } from "./types";

interface DirtyableInterface {
  isDirty: boolean;
  clean(): void;
}

function Dirtyable<T extends Constructor<{}>>(
  Base: T,
  ...propertyNames: string[]
): Constructor<DirtyableInterface> {
  return class extends Base implements DirtyableInterface {
    [property: string]: any;

    private __hidden_properties__: Map<
      string,
      {
        value: any;
        dirty: boolean;
      }
    > = new Map();

    constructor(...args: any[]) {
      super(...args);

      for (let i = 0; i < propertyNames.length; i++) {
        const propertyName = propertyNames[i];

        this.__hidden_properties__.set(propertyName, {
          value: this[propertyName],
          dirty: false,
        });

        Object.defineProperty(this, propertyName, {
          get: () => {
            return this.__hidden_properties__.get(propertyName)?.value;
          },
          set: (value) => {
            const hiddenProperty = this.__hidden_properties__.get(propertyName);

            if (hiddenProperty != null) {
              hiddenProperty.value = value;
              hiddenProperty.dirty = true;
            }
          },
        });
      }
    }

    get isDirty(): boolean {
      for (const [_, hiddenProperty] of this.__hidden_properties__) {
        if (hiddenProperty.dirty) {
          return true;
        }
      }

      return false;
    }

    clean() {
      for (const [_, hiddenProperty] of this.__hidden_properties__) {
        hiddenProperty.dirty = false;
      }
    }
  };
}

export default Dirtyable;
