import { SceneRepository } from './SceneRepository'
import { BaseService } from '~/src/Base/BaseService'
import { takeInstance } from '~/src/Common/Library/I'

export class SceneService extends BaseService {
  repositories = [takeInstance(SceneRepository)]
}
