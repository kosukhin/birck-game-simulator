import { Applier, BaseRepository } from '~/src/Base/BaseRepository'
import { CameraModel } from '~/src/Common/Library/ThreeD/Configs/CameraModel'
import { threeEulerSetFrom, threeVectorSetFrom } from '~/src/Common/Tools/Three'
import { takeSingleton } from '~/src/Common/Library/I'
import { RenderService } from '~/src/Common/Library/ThreeD/Services/RenderService'

export class CameraRenderRepository extends BaseRepository {
  registerApplier(): Applier {
    return [
      'Camera',
      (model: CameraModel) => {
        const renderService = takeSingleton(RenderService)
        renderService.setLeadDirection(model.direction)
        threeVectorSetFrom(renderService.camera.position, model.cameraPosition)
        threeEulerSetFrom(renderService.camera.rotation, model.cameraRotation)
      },
    ]
  }
}
