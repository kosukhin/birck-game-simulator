import { BaseModel } from '~/src/Base/BaseModel'
import { EKeyCode } from '~/src/Common/Types/GameTypes'

export class KeyPress extends BaseModel {
  constructor(readonly keyCode: EKeyCode) {
    super()
  }

  internalName(): string {
    return 'KeyPress'
  }
}
