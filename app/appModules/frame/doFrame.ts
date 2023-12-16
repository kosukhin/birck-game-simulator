import { renderServiceInContext } from '~~/app/appModules/context'
import { frameModel } from '~~/app/appModules/frame/frameModel'
import { baseSize } from '~~/src/Common/Constants/Three'
import { defineModelEffect } from '~~/src/Common/Library/I'

export const doFrame = defineModelEffect(frameModel, (model) => {
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
})
