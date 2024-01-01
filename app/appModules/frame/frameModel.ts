import { PointWithColorModel } from '~~/app/appModules/point/pointModel'

export class Frame {
  constructor(public pointGroups: Record<string, PointWithColorModel>) {}
}
