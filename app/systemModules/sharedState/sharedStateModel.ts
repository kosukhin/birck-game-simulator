import { defineModelFactory } from '~~/src/Common/Library/I'

export type SharedState = {
  path: string
}

export const sharedStateModel = defineModelFactory<SharedState>()({})
