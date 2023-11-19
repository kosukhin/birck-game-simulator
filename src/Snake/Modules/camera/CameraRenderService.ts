import { BaseService } from '~/src/Base/BaseService'
import { create } from '~/src/Common/Library/I'
import { CameraRenderRepository } from '~/src/Snake/Modules/camera/CameraRenderRepository'

export class CameraRenderService extends BaseService {
  repositories = [create(CameraRenderRepository)]
}
