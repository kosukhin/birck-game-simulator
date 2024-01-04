import { Floor } from '~~/app/appModules/common/floor'
import {
  gameInContext,
  renderServiceInContext,
} from '~~/app/appModules/inContext'

export type Scene = {
  size: [number, number]
  background: string
  soundToEvents: [string, string][]
  floor: Floor
}

export function renderScene(
  size: [number, number],
  background: string,
  soundToEvents: [string, string][],
  floor: Floor
) {
  const renderService = renderServiceInContext()
  renderService.applySceneConfig({
    size,
    background,
    soundToEvents,
    floor,
  })

  const game = gameInContext()
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
