import { BaseService } from '~/src/Base/BaseService'

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

export function create<T extends { new (...args: any[]): any }>(
  constructorFunction: T,
  ...args: ConstructorProps<T>
): ConstructorResult<T> {
  // eslint-disable-next-line new-cap
  return new constructorFunction(...args)
}

export function takeChanged<T extends { new (...args: any[]): any }>(
  constructorFunction: T,
  model: ConstructorResult<T>,
  fields: Partial<ConstructorResult<T>>
) {
  const newFields = Object.assign({ ...model }, fields)
  // @ts-ignore
  return create(constructorFunction, ...Object.values(newFields))
}

type Argument<T> = T extends (arg: infer U) => any ? U : never

export function reactOn<T extends (arg: any) => any>(fn: T, cb: Argument<T>) {
  return fn(cb)
}

export function applyProcess(fn: Function, ...args: any[]) {
  return fn(...args)
}

const singletons: any = {}
export function takeSingleton<T extends { new (...args: any[]): any }>(
  constructorFunction: T,
  ...args: ConstructorProps<T>
): ConstructorResult<T> {
  if (singletons[constructorFunction.name]) {
    return singletons[constructorFunction.name]
  }
  // eslint-disable-next-line new-cap
  singletons[constructorFunction.name] = new constructorFunction(...args)
  return singletons[constructorFunction.name]
}

export function takeService<T extends { new (...args: any[]): any }>(
  constructorFunction: T,
  ...args: ConstructorProps<T>
): ConstructorResult<T> {
  const instance: any = takeSingleton(constructorFunction, ...args)

  if (!(instance instanceof BaseService)) {
    throw new TypeError('Cant create service')
  }

  return instance.setup() as ConstructorResult<T>
}

export const defineModelFactory =
  <T>() =>
  <D extends Partial<T>>(defaults?: D) => {
    return (
      required?: Omit<T, keyof D> & Partial<D>,
      changed?: Partial<T>
    ): Readonly<T> => {
      return Object.freeze({
        ...defaults,
        ...required,
        ...changed,
      } as T)
    }
  }

export const defineModelEffect = <
  T extends (...args: any[]) => any,
  R extends any
>(
  // eslint-disable-next-line indent
  modelFactory: T,
  // eslint-disable-next-line indent
  fn: (model: ReturnType<T>) => R
  // eslint-disable-next-line indent
) => {
  return <CR = void>(
    ...args: Parameters<T>
  ): Readonly<CR extends void ? R : CR> => {
    const model = modelFactory(...args)
    return fn(model) as CR extends void ? R : CR
  }
}