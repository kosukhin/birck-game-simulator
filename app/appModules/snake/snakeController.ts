import { Floor } from '~~/app/appModules/common/floor/floor'
import { state } from '~~/app/systemModules/state/state'
import { mountedHook } from '~~/app/systemModules/mountedHook/mountedHook'
import { doScene } from '~~/app/appModules/common/scene/scene'
import {
  gameInContext,
  renderServiceInContext,
} from '~~/app/appModules/context'
import { doFrame } from '~~/app/appModules/frame/doFrame'
import { Frame } from '~~/app/appModules/frame/frameModel'
import { PointWithColorModel } from '~~/app/appModules/point/pointModel'
import { doTick } from '~~/app/appModules/tick/doTick'
import { sceneBackgroundColor } from '~~/src/Snake/Constants/colors'
import { gameSounds } from '~~/src/Snake/Constants/sounds'
import { floorTexture } from '~~/src/Snake/Constants/textures'
import { WfSnake, onFrame } from '~~/src/Snake/Workflows/WfSnake'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { ContextModels, inContext } from '~~/app/systemModules/context/context'
import { onNewKey } from '~~/src/Snake/Services/io'
import { doKeyPress } from '~~/app/appModules/keyPress/doKeyPress'
import { onTick } from '~~/src/Snake/Services/render'

const fieldSize: [number, number] = [15, 15]

export namespace snakeController {
  export function setup() {
    const renderService = new RenderService()
    const game = new WfSnake(...fieldSize)

    const snakeContext = new ContextModels({
      renderService,
      game,
    })

    inContext(snakeContext, initApp)

    onNewKey((keyCode) => {
      inContext(snakeContext, () => doKeyPress(keyCode))
    })

    onFrame(game, () => {
      inContext(snakeContext, handleFrame)
    })

    onTick(renderService, (additional: number) => {
      inContext(snakeContext, () => handleTick(additional))
    })

    const canvasWrapper = state()

    mountedHook(() => {
      renderService.render(canvasWrapper.get<HTMLElement>())
      game.run()
    })

    return canvasWrapper.target()
  }

  export function initApp() {
    doScene(
      fieldSize,
      sceneBackgroundColor,
      gameSounds,
      new Floor(floorTexture, [0, 0], [20, 20], 2400, 2400, 100, 1)
    )
  }

  export function handleFrame() {
    const theGame = gameInContext<WfSnake>()
    const theRenderService = renderServiceInContext()
    theRenderService.setGameSpeed(theGame.speed.value)
    const theFrame = new Frame({})
    theFrame.pointGroups[theGame.target.id] = new PointWithColorModel(
      0x00bb00,
      theGame.target.x,
      -theGame.target.y
    )
    theFrame.pointGroups.leadPoint = new PointWithColorModel(
      0xff2222,
      theGame.snake.leadPoint.x,
      -theGame.snake.leadPoint.y
    )
    theGame.snake.points.forEach((point: any) => {
      theFrame.pointGroups[point.id] = new PointWithColorModel(
        0xff5555,
        point.x,
        -point.y
      )
    })
    doFrame(theFrame)
  }

  export function handleTick(additional: number) {
    const theGame = gameInContext<WfSnake>()
    doTick(additional, theGame.snake.direction, theGame.snake.leadPoint)
  }
}
