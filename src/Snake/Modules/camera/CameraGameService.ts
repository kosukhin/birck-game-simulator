import { BaseService } from '~/src/Base/BaseService'
import { create, takeChanged } from '~/src/Common/Library/I'
import { CameraGameRepository } from '~/src/Snake/Modules/camera/CameraGameRepository'
import { CameraModel } from '~/src/Common/Library/ThreeD/Configs/CameraModel'
import { EMoveDirection, KeysToMoveMap } from '~/src/Common/Types/GameTypes'
import { camera3Check, camera3KeyMapper } from '~/src/Common/Tools/Camera'
import { passNotNullishValue } from '~/src/Common/Tools/LogicFlow'

export class CameraGameService extends BaseService {
  repositories = [create(CameraGameRepository)]

  calculateDirection(camera: CameraModel) {
    let newDirection = KeysToMoveMap[camera.directionKeyCode]

    if (camera3Check(camera.cameraType)) {
      newDirection = passNotNullishValue(
        camera3KeyMapper(camera.direction, camera.directionKeyCode),
        newDirection
      )
    }

    return takeChanged(CameraModel, camera, {
      direction: newDirection as EMoveDirection,
    })
  }
}
