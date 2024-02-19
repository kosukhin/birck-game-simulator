import { FloorModel } from '~/src/common/library/ThreeD/Configs/FloorModel'
import { BaseModel } from '~/src/Base/BaseModel'

export class Scene extends BaseModel {
  constructor(
    readonly size: [number, number],
    readonly background: string,
    readonly soundToEvents: [string, string][],
    readonly floor: FloorModel
  ) {
    super()
  }

  internalName(): string {
    return 'Scene'
  }
}
