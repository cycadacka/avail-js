
export interface LayerCollision {
  readonly name: string;
  compareLayer(secondary: string): boolean;
}

class LayerCollisionMatrix {
  private layers: Map<string, Map<string, boolean>> = new Map();

  constructor(layers: string[], matrix: (boolean|number)[][]) {
    for (let j = 0; j < layers.length; j++) {
      const layer1 = layers[j];
      const map1 = this.layers.set(layer1, new Map()).get(layer1)!;

      for (let k = 0; k < layers.length - j; k++) {
        const layer2 = layers[layers.length - k - 1];

        map1.set(layer2, !!matrix[j + k][j]);
      }
    }
  }

  /**
   * Get the collision
   *
   * @param {string} main
   * @return {*}  {(CollisionLayer | null)}
   * @memberof CollisionMatrix
   */
  getLayer(main: string): LayerCollision | null {
    if (this.compareLayer(main, main) == null) {
      return null;
    }

    return {
      name: main,
      compareLayer: (secondary: string) => this.compareLayer(main, secondary)!,
    };
  }

  /**
   * Set the collision state between two layers.
   *
   * @param {string} main
   * @param {string} secondary
   * @param {boolean} state
   * @memberof CollisionMatrix
   */
  setLayer(main: string, secondary: string, state: boolean) {
    const map = this.layers.get(main) ?? this.layers.get(secondary);

    if (map && map.has(secondary)) {
      map.set(secondary, state);
    }
  }

  /**
   * Returns the collision state between two layers.
   *
   * @param {string} main
   * @param {string} secondary
   * @return {(boolean | null)}
   * @memberof CollisionMatrix
   */
  compareLayer(main: string, secondary: string): boolean | null {
    return (this.layers.get(main)?.has(secondary) || this.layers.get(secondary)?.has(main)) ?? null;
  }
}

export default LayerCollisionMatrix;
