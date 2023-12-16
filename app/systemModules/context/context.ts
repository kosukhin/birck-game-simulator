import { InContextModel, contextModel, inContextModel } from './contextModel'
import { defineModelEffect } from '~~/src/Common/Library/I'

const contextStack: InContextModel[] = []

export const context = defineModelEffect(contextModel, (model) => {
  for (const contextModel of contextStack) {
    if (contextModel.models[model.key]) {
      return contextModel.models[model.key]
    }
  }

  throw new Error(`Unknonwn key ${model.key} in context!`)
})

export const inContext = defineModelEffect(inContextModel, (model) => {
  contextStack.unshift(model)
  model?.do?.()
  contextStack.shift()
})
