import { BaseModel } from '~~/src/Common/Config/Model'
import { TShapePosition } from '~~/src/Common/Types/GridTypes'

export class FloorModel extends BaseModel {
  constructor(
    readonly texture: string,
    readonly offset: TShapePosition,
    readonly repeat: TShapePosition,
    readonly width?: number,
    readonly height?: number,
    readonly widthSegments?: number,
    readonly heightSegments?: number
  ) {
    super()
  }
}
