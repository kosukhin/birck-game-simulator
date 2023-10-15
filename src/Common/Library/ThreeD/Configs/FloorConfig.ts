import { BaseConfig } from '~~/src/Common/Config/Config'
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

export class FloorConfig extends BaseConfig<FloorFields> {
  newInstance(newFields: FloorFields): this {
    return takeInstance(FloorConfig, newFields) as this
  }
}
