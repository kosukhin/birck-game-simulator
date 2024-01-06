import { renderServiceInContext } from '~~/app/appModules/inContext'
import { baseSize } from '~~/src/Common/Constants/Three'
import { PointWithColor } from '~~/src/Snake/Models'

export type PointsGroup = Record<string, PointWithColor>

export function renderFrame(pointsGroup: PointsGroup) {
  const renderService = renderServiceInContext()
  Object.entries(renderService.cubes).forEach(([id, cube]) => {
    if (id.indexOf('target_') === 0) {
      cube.visible = false
    }
  })
  Object.entries(pointsGroup).forEach(([id, point]) => {
    renderService.manageCube(
      id,
      point.x * baseSize,
      point.y * baseSize,
      point.color
    )
    const cube = renderService.cubes?.[id]
    cube && (cube.visible = true)
  })
  renderService.setLastUpdateTime(new Date().getTime())
}
