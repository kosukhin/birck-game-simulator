import { renderServiceInContext } from '~~/app/appModules/context'
import { Frame } from '~~/app/appModules/frame/frameModel'
import { baseSize } from '~~/src/Common/Constants/Three'

export const doFrame = (model: Frame) => {
  const renderService = renderServiceInContext()
  Object.entries(model.pointGroups).forEach(([id, point]) => {
    renderService.manageCube(
      id,
      point.x * baseSize,
      point.y * baseSize,
      point.color
    )
  })
  renderService.setLastUpdateTime(new Date().getTime())
}
