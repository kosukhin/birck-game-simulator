import { PointModel } from '~~/app/appModules/point/pointModel'
import { defineModelFactory } from '~~/src/Common/Library/I'
import { EMoveDirection } from '~~/src/Common/Types/GameTypes'

export type TickModel = {
  additional: number
  direction: EMoveDirection
  leadPoint: PointModel
}

export const tickModel = defineModelFactory<TickModel>()({})
