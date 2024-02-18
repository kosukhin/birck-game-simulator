import { Scene } from './Scene'
import { Applier, BaseRepository } from '~/src/Base/BaseRepository'
import { takeSingleton } from '~/src/Common/Library/I'
import { RenderService } from '~/src/Common/Library/ThreeD/Services/RenderService'

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
