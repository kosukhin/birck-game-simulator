import { curry } from 'lodash'
import { none, some } from '~~/src/common/library/adt'

export const booleanToMonad = curry((boolPredicate: Function, v: any) => {
  return boolPredicate() ? some(v) : none()
})

export const booleanToPromise = curry(
  (error: string, boolPredicate: Function, v: any) => {
    return boolPredicate() ? resolve(v) : reject(error)
  }
)

export const resolve = Promise.resolve.bind(Promise)

export const reject = (message: string) => Promise.reject(new Error(message))

const createSilentThenable = (error: any) => ({
  then() {},
  catch() {},
  finally(fn: Function) {
    fn(error)
    return this
  },
})
export const chainSilentThenable = (error: any) => createSilentThenable(error)
