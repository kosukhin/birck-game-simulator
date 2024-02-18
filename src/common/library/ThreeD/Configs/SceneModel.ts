import { FloorModel } from '~/src/Common/Library/ThreeD/Configs/FloorModel'
import { BaseModel } from '~/src/Base/BaseModel'

export class SceneModel extends BaseModel {
  constructor(
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
