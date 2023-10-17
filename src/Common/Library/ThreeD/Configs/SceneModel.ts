import { FloorModel } from '~/src/Common/Library/ThreeD/Configs/FloorModel'
import { BaseModel } from '~~/src/Common/Config/Model'

export class SceneModel extends BaseModel {
  constructor(
    readonly background: string,
    readonly soundToEvents: [string, string][],
    readonly floor: FloorModel
  ) {
    super()
  }
}
