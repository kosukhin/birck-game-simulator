import { Mesh } from 'three'
import { BaseConfig } from '~~/src/Common/Config/Config'
import { takeInstance } from '~~/src/Common/Library/I'

interface SceneFields {
  soundToEvents: [string, string][]
  background: any
  floor: Mesh
}

export class SceneConfig extends BaseConfig<SceneFields> {
  newInstance(newFields: SceneFields): this {
    return takeInstance(SceneConfig, newFields) as this
  }
}
