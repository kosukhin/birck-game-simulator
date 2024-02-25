import { curry } from 'lodash'

export type State<T> = {
  get: () => T
  set: (value: T) => void
}

export type FType<Ret extends any, Params extends Array<any> = []> = (
  ...args: Params
) => Ret

export const debug = curry((message: string, v: any) => {
  let isError = false
  if (v instanceof Error) {
    v = v.message
    isError = true
  }
  console.log(message.replace('{v}', JSON.stringify(v)))
  return isError ? Promise.reject(v) : Promise.resolve(v)
})
