import { SceneRepository } from './SceneRepository'
import { BaseService } from '~/src/Base/BaseService'
import { create } from '~/src/common/library/I'

export class SceneService extends BaseService {
  repositories = [create(SceneRepository)]
}
