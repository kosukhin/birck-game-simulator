import { Color, MathUtils } from 'three'
import { Floor } from '~~/app/appModules/common/floor'
import { renderScene } from '~~/app/appModules/common/scene'
import { PointsGroup, renderFrame } from '~~/app/appModules/frame'
import { cmd, startCommandsProcessor } from '~~/app/systemModules/command'
import { ContextModels, inContext } from '~~/app/systemModules/context'
import { mountedHook } from '~~/app/systemModules/mountedHook'
import { state } from '~~/app/systemModules/state'
import { gameInContext, renderServiceInContext } from '~~/context'
import { WfBlasteroid } from '~~/src/Blasteroid/Workflows/WfBlasteroid'
import GameCardVue from '~~/src/Common/Components/GameCard/GameCard.vue'
import { baseSize } from '~~/src/Common/Constants/Three'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import {
  EKeyCode,
  EMoveDirection,
  KeysToMoveMap,
} from '~~/src/Common/Types/GameTypes'
import { sceneBackgroundColor } from '~~/src/Snake/Constants/colors'
import { gameSounds } from '~~/src/Snake/Constants/sounds'
import { PointWithColor } from '~~/src/Snake/Models'
import { onNewKey } from '~~/src/Snake/Services/io'
import { onTick } from '~~/src/Snake/Services/render'
import { onFrame } from '~~/src/Snake/Workflows/WfSnake'

export namespace blasteroidController {
  export function setup() {
    const renderService = new RenderService()
    const game = new WfBlasteroid()

    const gameContext = new ContextModels({
      renderService,
      game,
    })

    startCommandsProcessor()
    inContext(gameContext, initApp)

    onNewKey((keyCode) => {
      game.move(KeysToMoveMap[keyCode] ?? EMoveDirection.up)

      if (keyCode === EKeyCode.SPC) {
        game.shoot()
      }
    })

    onFrame(game, () => {
      inContext(gameContext, handleFrame)
    })

    onTick(renderService, () => {
      inContext(gameContext, () => handleTick())
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
      [15, 20],
      sceneBackgroundColor,
      gameSounds,
      new Floor(
        '/images/textures/space.jpeg',
        [0, 0],
        [20, 20],
        2400,
        2400,
        100,
        1
      )
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
            theGame.target.x + cellIndex,
            -theGame.target.y - rowIndex
          )
        }
      })
    })

    theGame.blasteroid.bitmap.forEach((row, rowIndex) => {
      row.forEach((isFilled, cellIndex) => {
        const id = `blasteroid_${cellIndex}_${rowIndex}`
        if (isFilled) {
          theFrame[id] = new PointWithColor(
            0xff0000,
            theGame.blasteroid.x + cellIndex,
            -theGame.blasteroid.y - rowIndex
          )
        }
      })
    })

    renderFrame(theFrame)
  }

  export function handleTick() {
    const theGame = gameInContext<WfBlasteroid>()
    const theRenderService = renderServiceInContext()

    Object.values(theGame.shoots).forEach((shoot) => {
      if (!shoot.isDone) {
        cmd(() => {
          renderFrame({
            [`shoot_${shoot.id}`]: new PointWithColor(
              0xff6666,
              shoot.x,
              -shoot.y
            ),
          })
        })
      }
    })

    theRenderService.camera.position.z = 80
    theRenderService.camera.position.x =
      (theGame.blasteroid.x - 3) * baseSize + 40
    theRenderService.camera.position.y = -theGame.blasteroid.y * baseSize - 60

    theRenderService.camera.rotation.x = MathUtils.degToRad(45)
    theRenderService.camera.rotation.y = MathUtils.degToRad(0)
    theRenderService.camera.rotation.z = MathUtils.degToRad(0)
  }
}
