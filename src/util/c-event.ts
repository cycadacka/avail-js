
type CEventHandler<TEventParams> = (params: TEventParams) => void;

export interface IEvent<TEventParams> {
  subscribe(handler: CEventHandler<TEventParams>): void;
}

class CEvent<TEventParams> {
  protected subscribers: CEventHandler<TEventParams>[] = [];

  subscribe(handler: CEventHandler<TEventParams>): void {
    this.subscribers.push(handler);
  }

  async invoke(params: TEventParams) {
    for (let i = 0; i < this.subscribers.length; i++) {
      this.subscribers[i](params);
    } 
  }
}

export default CEvent;
