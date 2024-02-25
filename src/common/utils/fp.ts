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

export const whenFrameReady = <T extends any>(v: T): Promise<T> =>
  new Promise((resolve) => {
    requestAnimationFrame(() => resolve(v))
  })

export const reject = (message: string) => Promise.reject(new Error(message))

const createSilentThenable = (error: any) => ({
  then(...args: any[]) {
    args[1](error)
    return createSilentThenable(error)
  },
})
export const skipNextThens = (error: any): any => {
  return createSilentThenable(error)
}

export const noError = () => {}
