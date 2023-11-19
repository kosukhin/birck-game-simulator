type effectHandler<T extends any> = (model: any, ...args: any) => Promise<T> | T
const effects = new Map()

export function createEffect<U extends any>() {
  const id = Symbol('effect')
  const apply = <T = undefined>(
    model: any,
    ...args: any
  ): Promise<T extends undefined ? U : T> => {
    const applier = effects.get(id)

    if (!applier) {
      throw new Error(`No effect handler for model ${model.constructor.name}`)
    }

    const result = applier(model, ...args)

    if (!(result instanceof Promise)) {
      return Promise.resolve(result)
    }

    return result
  }

  return {
    id,
    apply,
  }
}

export function handleEffect(id: any, handler: effectHandler<any>) {
  effects.set(id, handler)
}
