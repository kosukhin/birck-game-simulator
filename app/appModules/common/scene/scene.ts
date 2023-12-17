import { sceneModel } from '~~/app/appModules/common/scene/sceneModel'
import {
  gameInContext,
  renderServiceInContext,
} from '~~/app/appModules/context'
import { defineModelEffect } from '~~/src/Common/Library/I'

export const doScene = defineModelEffect(sceneModel, (model) => {
  const renderService = renderServiceInContext()
  renderService.applySceneConfig(model)

  const game = gameInContext()
  model.soundToEvents.forEach((soundModel) => {
    const soundCb = () => renderService.sound(soundModel[0], soundModel[1])
    game.addEvent(soundModel[0], async () => {
      const sound = await soundCb()
      setTimeout(() => {
        sound.play()
      }, 33)
    })
  })
})
