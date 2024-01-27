export type State<T> = {
  get: () => T
  set: (value: T) => void
}

export type FType<Ret extends any, Params extends Array<any> = []> = (
  ...args: Params
) => Ret
