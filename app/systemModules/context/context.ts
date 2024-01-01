import { effect } from '~~/app/systemModules/base/effect'

export class ContextModels {
  constructor(public models: Record<string, any>) {}
}

const contextStack: ContextModels[] = []

export class Context {
  constructor(public key: string) {}
}

export const context = effect<typeof Context>((key) => {
  for (const contextModel of contextStack) {
    if (contextModel.models[key]) {
      return contextModel.models[key]
    }
  }

  throw new Error(`Unknonwn key ${key} in context!`)
})

export class InContext {
  constructor(public context: ContextModels, public fn?: Function) {}
}

export const inContext = effect<typeof InContext>((context, fn) => {
  contextStack.unshift(context)
  fn?.()
  contextStack.shift()
})
