import PolygonCollision from './polygon-collision';
import { CollisionInfo } from './types';

export interface CollisionEvent {
  subscribe(entity: string, handler: CollisionEventHandler): void;
}

export type CollisionEventHandler = (info: CollisionInfo & { frameUUID: string, other: string }) => void;

class CollisionEventImpl implements CollisionEvent {
  private subscribers: Map<string, CollisionEventHandler[]> = new Map();

  subscribe(entity: string, handler: CollisionEventHandler): void {
    let store = this.subscribers.get(entity);
    if (!store) {
      store = this.subscribers.set(entity, []).get(entity)!;
    }
    store.push(handler);
  }

  async invoke(entity: string, other: string, info: CollisionInfo, frameUUID: string): Promise<void> {
    let store = this.subscribers.get(entity);
    if (store) {
      const infoUnion = Object.assign(info, {
        other,
        frameUUID,
      });

      for (let i = 0; i < store.length; i++) {
        store[i](infoUnion);
      } 
    }
  }
}

export default CollisionEventImpl;
