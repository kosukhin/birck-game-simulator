export class Observable<T> {
  private subscribers: T[] = []

  registerSubscriber(subscriber: T) {
    this.subscribers.push(subscriber)
  }

  clearSubscribers() {
    this.subscribers = []
  }

  runSubscribers(params?: any) {
    this.subscribers.forEach((subscriber) => {
      ;(subscriber as any).call(this, params)
    })
  }
}
