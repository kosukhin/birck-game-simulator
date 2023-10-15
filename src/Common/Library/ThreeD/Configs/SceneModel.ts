import { BaseConfig } from '~~/src/Common/Config/Config'
import { takeInstance } from '~~/src/Common/Library/I'
import { FloorModel } from '~/src/Common/Library/ThreeD/Configs/FloorModel'

interface SceneFields {
  soundToEvents: [string, string][]
  background: string
  floor: FloorModel
}

export class SceneModel extends BaseConfig<SceneFields> {
  newInstance(newFields: SceneFields): this {
    return takeInstance(SceneModel, newFields) as this
  }
}
