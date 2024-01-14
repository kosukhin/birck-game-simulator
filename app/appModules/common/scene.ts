import { Floor } from '~~/app/appModules/common/floor'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { IGameWorkflow } from '~~/src/Common/Types/GameTypes'

export type Scene = {
  size: [number, number]
  background: string
  soundToEvents: [string, string][]
  floor: Floor
}

export function renderScene(
  getGame: () => IGameWorkflow,
  getRenderService: () => RenderService,
  size: [number, number],
  background: string,
  soundToEvents: [string, string][],
  floor: Floor
) {
  const renderService = getRenderService()
  renderService.applySceneConfig({
    size,
    background,
    soundToEvents,
    floor,
  })

  const game = getGame()
  soundToEvents.forEach((soundModel) => {
    const soundCb = () => renderService.sound(soundModel[0], soundModel[1])
    game.addEvent(soundModel[0], async () => {
      const sound = await soundCb()
      setTimeout(() => {
        sound.play()
      }, 33)
    })
  })
}
