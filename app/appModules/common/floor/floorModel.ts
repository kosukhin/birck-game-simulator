import { defineModelFactory } from '~~/src/Common/Library/I'
import { TShapePosition } from '~~/src/Common/Types/GridTypes'

export type FloorModel = {
  texture: string
  offset: TShapePosition
  repeat: TShapePosition
  width?: number
  height?: number
  widthSegments?: number
  heightSegments?: number
}

export const floorModel = defineModelFactory<FloorModel>()({})
