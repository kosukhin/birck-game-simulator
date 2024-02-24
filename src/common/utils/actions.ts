import { curry } from 'lodash'

export const repeat = curry(
  (fn: Function, milliseconds: Function | number, context: any) => {
    let ms = milliseconds
    if (typeof milliseconds === 'function') {
      ms = milliseconds()
    }
    setTimeout(() => {
      fn()
    }, ms as number)
    return context
  }
)
