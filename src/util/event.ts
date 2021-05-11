
type EventHandler<TEventParams> = (params: TEventParams) => void;

export interface IEvent<TEventParams> {
  subscribe(handler: EventHandler<TEventParams>): void;
}

class Event<TEventParams> {
  protected subscribers: EventHandler<TEventParams>[] = [];

  subscribe(handler: EventHandler<TEventParams>): void {
    this.subscribers.push(handler);
  }

  async invoke(params: TEventParams) {
    for (let i = 0; i < this.subscribers.length; i++) {
      this.subscribers[i](params);
    } 
  }
}

export default Event;
