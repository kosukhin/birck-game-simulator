import { Euler, MathUtils, Vector3 } from 'three'
import { RenderService } from './../../Common/Library/ThreeD/Services/RenderService'
import { baseSize } from '~~/src/Common/Constants/Three'
import { toBaseSize } from '~~/src/Common/Tools/Cast'
import { iterate } from '~~/src/Common/Tools/LogicFlow'
import { threeVectorSetFrom } from '~~/src/Common/Tools/Three'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'
import { CameraRotation } from '~~/src/Snake/Models/CameraRotation'

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

export function useNextFrameDrawProcedure(
  rserv: RenderService,
  game: WfSnake,
  startForwardPosition: Vector3
) {
  threeVectorSetFrom(rserv.camera.position, startForwardPosition)
  rserv.manageCube(
    game.target.id,
    toBaseSize(game.target.x),
    toBaseSize(-game.target.y),
    0x00aa00
  )

  rserv.manageCube(
    'leadPoint',
    toBaseSize(game.snake.leadPoint.x),
    toBaseSize(-game.snake.leadPoint.y),
    0xaa0000
  )

  rserv.setCameraPointId(game.snake.points[1].id)
  rserv.setLastUpdateTime(new Date().getTime())
  rserv.setGameSpeed(game.speed.value)
  game.snake.points.forEach((point: any) => {
    rserv.manageCube(
      point.id,
      toBaseSize(point.x),
      toBaseSize(-point.y),
      0x8888ff
    )
  })
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
