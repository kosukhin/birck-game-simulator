export class Functor {
  protected value: any

  constructor(value: any) {
    this.value = value
  }

  map(fn: Function) {
    this.value = fn(this.value)
    return this
  }
}
