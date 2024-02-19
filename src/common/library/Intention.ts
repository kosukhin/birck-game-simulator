import { Functor } from '~/src/common/library/Functor'

type Predicate = (value: any) => boolean

export class Intention extends Functor {
  #predicate: Predicate = () => true

  predicate(fn: (value: any) => boolean) {
    this.#predicate = fn
    return this
  }

  map(fn: Function): this {
    if (this.#predicate(this.value)) {
      return super.map(fn)
    }

    return this
  }
}
