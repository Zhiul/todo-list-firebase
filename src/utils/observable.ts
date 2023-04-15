export class Observable {
  observers: Function[];

  constructor() {
    this.observers = [];
  }

  subscribe(func: Function) {
    this.observers.push(func);
  }

  unsubscribe(func: Function) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  notify(data: any) {
    this.observers.forEach((observer) => observer(data));
  }
}
