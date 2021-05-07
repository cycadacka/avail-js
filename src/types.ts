
export type PointLike = {
  x: number;
  y: number;
};

export type ClassConstructor<T> = new(...args: any[]) => T;

export interface ArrayProxy<T> {
  [Symbol.iterator](): Generator<T, void, unknown>;
  get(index: number): T;
  readonly length: number;
}

