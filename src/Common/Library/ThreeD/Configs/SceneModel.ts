import { BaseModel } from '~/src/Common/Config/Model'
import { takeInstance } from '~~/src/Common/Library/I'
import { FloorModel } from '~/src/Common/Library/ThreeD/Configs/FloorModel'

interface SceneFields {
  soundToEvents: [string, string][]
  background: string
  floor: FloorModel
}

export class SceneModel extends BaseModel<SceneFields> {
  newInstance(newFields: SceneFields): this {
    return takeInstance(SceneModel, newFields) as this
  }
}
