import { Scene } from './Scene'
import { handleEffect } from '~/src/common/library/effect'
import { sceneEffect } from '~/src/common/library/ThreeD/Modules/scene/sceneEffect'
import { RenderService } from '~/src/common/library/ThreeD/Services/RenderService'

export const sceneEffectHandler = () =>
  handleEffect(sceneEffect.id, (model: Scene, renderService: RenderService) => {
    renderService.applySceneConfig(model)
  })
