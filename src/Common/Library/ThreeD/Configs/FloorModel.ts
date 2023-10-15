import { BaseModel } from '~/src/Common/Config/Model'
import { takeInstance } from '~~/src/Common/Library/I'
import { TShapePosition } from '~~/src/Common/Types/GridTypes'

interface FloorFields {
  texture: string
  offset: TShapePosition
  repeat: TShapePosition
  width?: number
  height?: number
  widthSegments?: number
  heightSegments?: number
}

export class FloorModel extends BaseModel<FloorFields> {
  newInstance(newFields: FloorFields): this {
    return takeInstance(FloorModel, newFields) as this
  }
}
