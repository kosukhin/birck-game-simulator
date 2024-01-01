import { Floor } from './../common/floor/floor'
import { doScene } from '~~/app/appModules/common/scene/scene'
import {
  gameInContext,
  renderServiceInContext,
} from '~~/app/appModules/context'
import { doFrame } from '~~/app/appModules/frame/doFrame'
import { frameModel } from '~~/app/appModules/frame/frameModel'
import {
  pointModel,
  pointWithColorModel,
} from '~~/app/appModules/point/pointModel'
import { doTick } from '~~/app/appModules/tick/doTick'
import { sceneBackgroundColor } from '~~/src/Snake/Constants/colors'
import { gameSounds } from '~~/src/Snake/Constants/sounds'
import { floorTexture } from '~~/src/Snake/Constants/textures'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

export namespace snakeController {
  export function initApp() {
    doScene(
      [15, 15],
      sceneBackgroundColor,
      gameSounds,
      new Floor(floorTexture, [0, 0], [20, 20], 2400, 2400, 100, 1)
    )
  }

  export function handleFrame() {
    const theGame = gameInContext<WfSnake>()
    const theRenderService = renderServiceInContext()
    theRenderService.setGameSpeed(theGame.speed.value)
    const theFrame = frameModel({
      pointGroups: {},
    })
    theFrame.pointGroups[theGame.target.id] = pointWithColorModel({
      color: 0x00bb00,
      x: theGame.target.x,
      y: -theGame.target.y,
    })
    theFrame.pointGroups.leadPoint = pointWithColorModel({
      color: 0xff2222,
      x: theGame.snake.leadPoint.x,
      y: -theGame.snake.leadPoint.y,
    })
    theGame.snake.points.forEach((point: any) => {
      theFrame.pointGroups[point.id] = pointWithColorModel({
        color: 0xff5555,
        x: point.x,
        y: -point.y,
      })
    })
    doFrame(theFrame)
  }

  export function handleTick(additional: number) {
    const theGame = gameInContext<WfSnake>()
    const leadPoint = pointModel({
      x: theGame.snake.leadPoint.x,
      y: theGame.snake.leadPoint.y,
    })
    doTick({
      additional,
      direction: theGame.snake.direction,
      leadPoint,
    })
  }
}
