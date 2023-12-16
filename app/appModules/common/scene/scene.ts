import { sceneModel } from '~~/app/appModules/common/scene/sceneModel'
import { context } from '~~/app/systemModules/context/context'
import { defineModelEffect } from '~~/src/Common/Library/I'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'

export const scene = defineModelEffect(sceneModel, (model) => {
  const renderService = context<RenderService>({
    key: 'renderService',
  })
  renderService.applySceneConfig(model)
})
