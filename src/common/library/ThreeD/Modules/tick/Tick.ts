import { BaseModel } from '~/src/Base/BaseModel'
import { EMoveDirection } from '~~/src/common/types/GameTypes'
import { Point } from '~/src/Snake/Models'

export class Tick extends BaseModel {
  constructor(
    readonly additional: number,
    readonly direction: EMoveDirection,
    readonly leadPoint: Point
  ) {
    super()
  }

  internalName(): string {
    return 'KeyPress'
  }
}
