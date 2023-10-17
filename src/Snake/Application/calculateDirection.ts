import { CameraModel } from './../../Common/Library/ThreeD/Configs/CameraModel'
import { thenIf, passNotNullishValue } from '~~/src/Common/Tools/LogicFlow'
import { EMoveDirection, KeysToMoveMap } from '~~/src/Common/Types/GameTypes'
import { camera3KeyMapper, camera3Check } from '~~/src/Common/Tools/Camera'

export function calculateDirection(camera: CameraModel) {
  let newDirection = KeysToMoveMap[camera.directionKeyCode]

  thenIf(camera3Check(camera.cameraType), () => {
    newDirection = passNotNullishValue(
      camera3KeyMapper(camera.direction, camera.directionKeyCode),
      newDirection
    )
  })

  return camera.modify({
    direction: newDirection as EMoveDirection,
  })
}
