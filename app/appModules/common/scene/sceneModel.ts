import { FloorModel } from '~~/app/appModules/common/floor/floorModel'
import { defineModelFactory } from '~~/src/Common/Library/I'

export type SceneModel = {
  size: [number, number]
  background: string
  soundToEvents: [string, string][]
  floor: FloorModel
}

export const sceneModel = defineModelFactory<SceneModel>()({})
