export type ConstructorProps<T> = T extends {
  new (...args: infer U): any
}
  ? U
  : never

export type ConstructorResult<T> = T extends {
  new (...args: any): infer U
}
  ? U
  : never

export type NoMethods<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

export function takeInstance<T extends { new (...args: any[]): any }>(
  constructorFunction: T,
  ...args: ConstructorProps<T>
): ConstructorResult<T> {
  // eslint-disable-next-line new-cap
  return new constructorFunction(...args)
}

type Argument<T> = T extends (arg: infer U) => any ? U : never

export function reactOn<T extends (arg: any) => any>(fn: T, cb: Argument<T>) {
  return fn(cb)
}

export function applyProcess(fn: Function, ...args: any[]) {
  return fn(...args)
}
