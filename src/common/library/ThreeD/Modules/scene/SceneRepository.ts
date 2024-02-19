import { Scene } from './Scene'
import { Applier, BaseRepository } from '~/src/Base/BaseRepository'
import { takeSingleton } from '~/src/common/library/I'
import { RenderService } from '~/src/common/library/ThreeD/Services/RenderService'

export class SceneRepository extends BaseRepository {
  registerApplier(): Applier {
    return [
      'Scene',
      (model: Scene) => {
        const renderService = takeSingleton(RenderService)
        renderService.applySceneConfig(model)

        return true
      },
    ]
  }
}
