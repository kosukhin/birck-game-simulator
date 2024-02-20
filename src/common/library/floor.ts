import { TShapePosition } from '~~/src/common/types/GridTypes'

export class Floor {
  constructor(
    public texture: string,
    public offset: TShapePosition,
    public repeat: TShapePosition,
    public width?: number,
    public height?: number,
    public widthSegments?: number,
    public heightSegments?: number
  ) {}
}
