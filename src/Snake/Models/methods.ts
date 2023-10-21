import { CameraModel } from '~/src/Common/Library/ThreeD/Configs/CameraModel'
import { EMoveDirection, KeysToMoveMap } from '~/src/Common/Types/GameTypes'
import { passNotNullishValue, thenIf } from '~/src/Common/Tools/LogicFlow'
import { camera3Check, camera3KeyMapper } from '~/src/Common/Tools/Camera'
import { Cube, SnakeGame } from '~/src/Snake/Models/index'
import { takeInstance } from '~/src/Common/Library/I'
import {
  leadPointColor,
  snakeTailColor,
  targetColor,
} from '~/src/Snake/Constants/colors'
import { leadPointId, targetPointId } from '~/src/Snake/Constants/game'

export function mCalculateDirection(camera: CameraModel) {
  let newDirection = KeysToMoveMap[camera.directionKeyCode]

  thenIf(camera3Check(camera.cameraType), () => {
    newDirection = passNotNullishValue(
      camera3KeyMapper(camera.direction, camera.directionKeyCode),
      newDirection
    )
  })

  return camera.takeChanged({
    direction: newDirection as EMoveDirection,
  })
}

export function mDrawFrameCubes(snakeGame: SnakeGame) {
  const tailCubes = snakeGame.tail.points.map((point) => {
    return takeInstance(Cube, point.id, snakeTailColor, point.x, point.y)
  })

  return {
    target: takeInstance(
      Cube,
      targetPointId,
      targetColor,
      snakeGame.target.x,
      snakeGame.target.y
    ),
    lead: takeInstance(
      Cube,
      leadPointId,
      leadPointColor,
      snakeGame.lead.x,
      snakeGame.lead.y
    ),
    tail: tailCubes,
  }
}
