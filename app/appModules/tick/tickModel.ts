import { PointModel } from '~~/app/appModules/point/pointModel'
import { EMoveDirection } from '~~/src/Common/Types/GameTypes'

export class Tick {
  constructor(
    public additional: number,
    public direction: EMoveDirection,
    public leadPoint: PointModel
  ) {}
}
