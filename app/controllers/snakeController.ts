import { Floor } from '~~/app/appModules/common/floor'
import { renderScene } from '~~/app/appModules/common/scene'
import { PointsGroup, renderFrame } from '~~/app/appModules/frame'
import {
  gameInContext,
  renderServiceInContext,
} from '~~/app/appModules/inContext'
import { doKeyPress } from '~~/app/appModules/keyPress'
import { renderTick } from '~~/app/appModules/tick'
import { inContext } from '~~/app/systemModules/context'
import { mountedHook } from '~~/app/systemModules/mountedHook'
import { state } from '~~/app/systemModules/state'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { sceneBackgroundColor } from '~~/src/Snake/Constants/colors'
import { gameSounds } from '~~/src/Snake/Constants/sounds'
import { floorTexture } from '~~/src/Snake/Constants/textures'
import { Point, PointWithColor } from '~~/src/Snake/Models'
import { onNewKey } from '~~/src/Snake/Services/io'
import { onTick } from '~~/src/Snake/Services/render'
import { WfSnake, onFrame } from '~~/src/Snake/Workflows/WfSnake'

const fieldSize: [number, number] = [15, 15]

export namespace snakeController {
  export function setup() {
    const renderService = new RenderService()
    const game = new WfSnake(...fieldSize)

    const snakeContext = {
      models: {
        renderService,
        game,
      },
    }

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

    return {
      canvasWrapper: canvasWrapper.target(),
      game,
    }
  }

  export function initApp() {
    renderScene(
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
    const theFrame: PointsGroup = {}
    theFrame[theGame.target.id] = new PointWithColor(
      0x00bb00,
      theGame.target.x,
      -theGame.target.y
    )
    theFrame.leadPoint = new PointWithColor(
      0xff2222,
      theGame.snake.leadPoint.x,
      -theGame.snake.leadPoint.y
    )
    theGame.snake.points.forEach((point: any) => {
      theFrame[point.id] = new PointWithColor(0xff5555, point.x, -point.y)
    })
    renderFrame(theFrame)
  }

  export function handleTick(additional: number) {
    const theGame = gameInContext<WfSnake>()
    renderTick(
      additional,
      theGame.snake.direction,
      new Point(theGame.snake.leadPoint.x, theGame.snake.leadPoint.y)
    )
  }
}
