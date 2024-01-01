import { Floor } from '~~/app/appModules/common/floor/floor'
import {
  gameInContext,
  renderServiceInContext,
} from '~~/app/appModules/context'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

export class Scene {
  constructor(
    public size: [number, number],
    public background: string,
    public soundToEvents: [string, string][],
    public floor: Floor
  ) {}
}

export const doScene = (...props: ConstructorParameters<typeof Scene>) => {
  const model = new Scene(...props)
  const renderService = renderServiceInContext()
  renderService.applySceneConfig(model)

  const game = gameInContext<WfSnake>()
  model.soundToEvents.forEach((soundModel) => {
    const soundCb = () => renderService.sound(soundModel[0], soundModel[1])
    game.addEvent(soundModel[0], async () => {
      const sound = await soundCb()
      setTimeout(() => {
        sound.play()
      }, 33)
    })
  })
}
