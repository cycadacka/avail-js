
type UtilityEventHandler<TParams> = (params: TParams) => void;

export interface IEvent<TParams> {
  subscribe(handler: UtilityEventHandler<TParams>): void;
}

class UtilityEvent<TParams> {
  protected subscribers: UtilityEventHandler<TParams>[] = [];

  subscribe(handler: UtilityEventHandler<TParams>): void {
    this.subscribers.push(handler);
  }

  async invoke(params: TParams) {
    for (let i = 0; i < this.subscribers.length; i++) {
      this.subscribers[i](params);
    } 
  }
}

export default UtilityEvent;
