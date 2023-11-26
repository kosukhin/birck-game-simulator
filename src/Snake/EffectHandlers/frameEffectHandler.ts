import { handleEffect } from '~/src/Common/Library/effect'
import { frameEffect } from '~/src/Snake/Effects/frameEffect'
import { RenderService } from '~/src/Common/Library/ThreeD/Services/RenderService'
import { Frame } from '~/src/Common/Library/ThreeD/Modules/frame/Frame'

const baseSize = 10
export const frameEffectHandler = () =>
  handleEffect(frameEffect.id, (model: Frame, renderService: RenderService) => {
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
