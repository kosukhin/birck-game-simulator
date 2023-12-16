import { defineModelFactory } from '~~/src/Common/Library/I'
import { EKeyCode } from '~~/src/Common/Types/GameTypes'

export type KeyPressModel = {
  keyCode: EKeyCode
}

export const keyPressModel = defineModelFactory<KeyPressModel>()({})
