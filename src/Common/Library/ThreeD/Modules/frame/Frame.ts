import { BaseModel } from '~/src/Base/BaseModel'
import { Point } from '~/src/Snake/Models'

export class Frame extends BaseModel {
  constructor(readonly pointGroups: Record<string, Point[]>) {
    super()
  }

  internalName(): string {
    return 'KeyPress'
  }
}
