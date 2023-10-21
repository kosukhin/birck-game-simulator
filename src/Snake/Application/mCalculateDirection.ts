import { CameraModel } from './../../Common/Library/ThreeD/Configs/CameraModel'
import { passNotNullishValue, thenIf } from '~~/src/Common/Tools/LogicFlow'
import { EMoveDirection, KeysToMoveMap } from '~~/src/Common/Types/GameTypes'
import { camera3Check, camera3KeyMapper } from '~~/src/Common/Tools/Camera'

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
