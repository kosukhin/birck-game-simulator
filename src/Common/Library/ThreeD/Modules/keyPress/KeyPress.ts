import { BaseModel } from '~/src/Base/BaseModel'
import { EKeyCode } from '~/src/Common/Types/GameTypes'
import { defineModelFactory } from '~~/src/Common/Library/I'

export class KeyPress extends BaseModel {
  constructor(readonly keyCode: EKeyCode) {
    super()
  }

  internalName(): string {
    return 'KeyPress'
  }
}

export const keyPressModel = defineModelFactory<KeyPress>()({})
