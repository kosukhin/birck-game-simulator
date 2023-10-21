import { Euler, MathUtils, Vector3 } from 'three'
import { partial } from 'lodash'
import { RenderService } from './../../Common/Library/ThreeD/Services/RenderService'
import { baseSize } from '~~/src/Common/Constants/Three'
import { toBaseSize } from '~~/src/Common/Tools/Cast'
import { iterate } from '~~/src/Common/Tools/LogicFlow'
import { threeVectorSetFrom } from '~~/src/Common/Tools/Three'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'
import { CameraRotation } from '~~/src/Snake/Models/CameraRotation'
import { oCreateSnakeGameModel } from '~/src/Snake/Services/toModels'
import { oManageCube } from '~/src/Snake/Services/render'
import { mDrawFrameCubes } from '~/src/Snake/Models/methods'

export function useBordersDrawProcedure(rserv: RenderService, game: WfSnake) {
  const { width, height } = game.grid
  const borderColor = 0x2b241d

  iterate((i) => {
    rserv.createCube(`top${i}`, toBaseSize(i), baseSize, borderColor)
    rserv.createCube(
      `bottom${i}`,
      toBaseSize(i),
      toBaseSize(-height),
      borderColor
    )
  }, width)

  iterate((i) => {
    rserv.createCube(`left${i}`, -baseSize, toBaseSize(-i), borderColor)
    rserv.createCube(
      `right${i}`,
      toBaseSize(width),
      toBaseSize(-i),
      borderColor
    )
  }, height)
}

export function cNextFrameDrawProcedure(
  rserv: RenderService,
  game: WfSnake,
  startForwardPosition: Vector3
) {
  const snakeGame = oCreateSnakeGameModel(game)
  const cubes = mDrawFrameCubes(snakeGame)
  oManageCube(rserv, cubes.target)
  oManageCube(rserv, cubes.lead)
  cubes.tail.forEach(partial(oManageCube, rserv))

  // TODO над нижней частью нужно подумать
  threeVectorSetFrom(rserv.camera.position, startForwardPosition)
  rserv.setCameraPointId(game.snake.points[1].id)
  rserv.setLastUpdateTime(new Date().getTime())
  rserv.setGameSpeed(game.speed.value)
}

export function useDrawTickProcedure(
  rserv: RenderService,
  game: WfSnake,
  cameraRotation: CameraRotation
) {
  const leadPoint = rserv.cubes[rserv.leadId]

  if (!leadPoint) {
    return
  }

  const { direction } = game.snake
  let { x, y } = leadPoint.position
  const {
    y: dy,
    x: dx,
    yMul,
    xMul,
    rotationDeg,
  } = cameraRotation.byDirection(direction)

  y += dy
  x += dx
  const newRotation = new Euler(0, 0, 0)
  newRotation.set(
    MathUtils.degToRad(rotationDeg[0]),
    MathUtils.degToRad(rotationDeg[1]),
    MathUtils.degToRad(rotationDeg[2])
  )

  return {
    x,
    y,
    yMul,
    xMul,
    newRotation,
  }
}
