import { defineModelFactory } from '~~/src/Common/Library/I'

export type ContextModel = {
  key: string
}

export const contextModel = defineModelFactory<ContextModel>()({})

export type InContextModel = {
  models: Record<string, any>
  do?: Function
}

export const inContextModel = defineModelFactory<InContextModel>()({})
