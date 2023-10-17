import { CameraModel } from '~~/src/Common/Library/ThreeD/Configs/CameraModel'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import {
  threeEulerSetFrom,
  threeVectorSetFrom,
} from '~~/src/Common/Tools/Three'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

export function applyCameraModelToGame(game: WfSnake, camera: CameraModel) {
  game.moveSnake(camera.direction)
}

export function applyCameraModelToRenderService(
  rserv: RenderService,
  camera: CameraModel
) {
  rserv.setLeadDirection(camera.direction)
  threeVectorSetFrom(rserv.camera.position, camera.cameraPosition)
  threeEulerSetFrom(rserv.camera.rotation, camera.cameraRotation)
}
