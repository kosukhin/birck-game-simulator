import { Floor } from '~~/app/appModules/common/floor'
import { renderScene } from '~~/app/appModules/common/scene'
import { PointsGroup, renderFrame } from '~~/app/appModules/frame'
import { doKeyPress } from '~~/app/appModules/keyPress'
import { renderTick } from '~~/app/appModules/tick'
import { inContext } from '~~/app/systemModules/context'
import { mountedHook } from '~~/app/systemModules/mountedHook'
import { state } from '~~/app/systemModules/state'
import { gameInContext, renderServiceInContext } from '~~/context'
import { WfBlasteroid } from '~~/src/Blasteroid/Workflows/WfBlasteroid'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { gameSounds } from '~~/src/Snake/Constants/sounds'
import { floorTexture } from '~~/src/Snake/Constants/textures'
import { Point, PointWithColor } from '~~/src/Snake/Models'
import { onNewKey } from '~~/src/Snake/Services/io'
import { onTick } from '~~/src/Snake/Services/render'
import { onFrame } from '~~/src/Snake/Workflows/WfSnake'

export namespace blasteroidController {
  export function setup() {
    const renderService = new RenderService()
    const game = new WfBlasteroid()

    const gameContext = {
      models: {
        renderService,
        game,
      },
    }

    inContext(gameContext, initApp)

    onNewKey((keyCode) => {
      inContext(gameContext, () => doKeyPress(keyCode))
    })

    onFrame(game, () => {
      inContext(gameContext, handleFrame)
    })

    onTick(renderService, (additional: number) => {
      inContext(gameContext, () => handleTick(additional))
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
      [20, 15],
      '/images/textures/space.jpeg',
      gameSounds,
      new Floor(floorTexture, [0, 0], [20, 20], 2400, 2400, 100, 1)
    )
  }

  export function handleFrame() {
    const theGame = gameInContext<WfBlasteroid>()
    const theRenderService = renderServiceInContext()
    theRenderService.setGameSpeed(theGame.speed.value)
    const theFrame: PointsGroup = {}

    theGame.target.bitmap.forEach((row, rowIndex) => {
      row.forEach((isFilled, cellIndex) => {
        const id = `target_${cellIndex}_${rowIndex}`
        if (isFilled) {
          theFrame[id] = new PointWithColor(
            0x888888,
            theGame.target.x,
            -theGame.target.y
          )
        }
      })
    })

    theGame.blasteroid.bitmap.forEach((row, rowIndex) => {
      row.forEach((isFilled, cellIndex) => {
        const id = `blasteroid_${cellIndex}_${rowIndex}`
        if (isFilled) {
          theFrame[id] = new PointWithColor(
            0x888888,
            theGame.target.x,
            -theGame.target.y
          )
        }
      })
    })

    renderFrame(theFrame)
  }

  export function handleTick(additional: number) {
    const theGame = gameInContext<WfBlasteroid>()
    renderTick(
      additional,
      theGame.blasteroid.direction,
      new Point(theGame.blasteroid.x, theGame.blasteroid.y)
    )
  }
}
