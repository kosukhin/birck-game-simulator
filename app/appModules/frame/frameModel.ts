import { PointWithColorModel } from '~~/app/appModules/point/pointModel'
import { defineModelFactory } from '~~/src/Common/Library/I'

export type FrameModel = {
  pointGroups: Record<string, PointWithColorModel>
}

export const frameModel = defineModelFactory<FrameModel>()({})
