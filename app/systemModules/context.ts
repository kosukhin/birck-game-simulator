export class ContextModels {
  constructor(public models: Record<string, any>) {}
}

const contextStack: ContextModels[] = []

export function context<T>(key: string): T {
  for (const contextModel of contextStack) {
    if (contextModel.models[key]) {
      return contextModel.models[key]
    }
  }

  throw new Error(`Unknonwn key ${key} in context!`)
}

export function inContext(context: ContextModels, fn?: Function) {
  contextStack.unshift(context)
  fn?.()
}
