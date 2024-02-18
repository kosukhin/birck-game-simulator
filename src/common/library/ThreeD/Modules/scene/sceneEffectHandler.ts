import { Scene } from './Scene'
import { handleEffect } from '~/src/Common/Library/effect'
import { sceneEffect } from '~/src/Common/Library/ThreeD/Modules/scene/sceneEffect'
import { RenderService } from '~/src/Common/Library/ThreeD/Services/RenderService'

export const sceneEffectHandler = () =>
  handleEffect(sceneEffect.id, (model: Scene, renderService: RenderService) => {
    renderService.applySceneConfig(model)
  })
