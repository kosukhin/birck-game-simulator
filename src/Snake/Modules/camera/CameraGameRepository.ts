import { Applier, BaseRepository } from '~/src/Base/BaseRepository'
import { CameraModel } from '~/src/Common/Library/ThreeD/Configs/CameraModel'
import { WfSnake } from '~/src/Snake/Workflows/WfSnake'

export class CameraGameRepository extends BaseRepository {
  registerApplier(): Applier {
    return [
      'Camera',
      (model: CameraModel, game: WfSnake) => {
        game.moveSnake(model.direction)
      },
    ]
  }
}
