import { TShapePosition } from '~~/src/Common/Types/GridTypes'

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
