import { renderServiceInContext } from '~~/app/appModules/inContext'
import { baseSize } from '~~/src/Common/Constants/Three'
import { PointWithColor } from '~~/src/Snake/Models'

export type PointsGroup = Record<string, PointWithColor>

export function renderFrame(pointsGroup: PointsGroup) {
  const renderService = renderServiceInContext()
  Object.entries(pointsGroup).forEach(([id, point]) => {
    renderService.manageCube(
      id,
      point.x * baseSize,
      point.y * baseSize,
      point.color
    )
  })
  renderService.setLastUpdateTime(new Date().getTime())
}
