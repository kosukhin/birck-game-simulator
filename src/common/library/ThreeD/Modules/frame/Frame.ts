import { BaseModel } from '~/src/Base/BaseModel'
import { PointWithColor } from '~/src/Snake/Models'

export class Frame extends BaseModel {
  constructor(readonly pointGroups: Record<string, PointWithColor>) {
    super()
  }

  internalName(): string {
    return 'KeyPress'
  }
}
