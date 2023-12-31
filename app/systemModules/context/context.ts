export class ContextModels {
  constructor(public models: Record<string, any>) {}
}

const contextStack: ContextModels[] = []

export class Context {
  constructor(public key: string) {}
}

export const context = <T extends unknown>(
  ...props: ConstructorParameters<typeof Context>
) => {
  const model = new Context(...props)
  for (const contextModel of contextStack) {
    if (contextModel.models[model.key]) {
      return contextModel.models[model.key] as T
    }
  }

  throw new Error(`Unknonwn key ${model.key} in context!`)
}

export class InContext {
  constructor(public context: ContextModels, public fn?: Function) {}
}

export const inContext = (
  ...props: ConstructorParameters<typeof InContext>
) => {
  const model = new InContext(...props)
  contextStack.unshift(model.context)
  model?.fn?.()
  contextStack.shift()
}
