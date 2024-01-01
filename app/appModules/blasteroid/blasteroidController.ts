import { Floor } from '~~/app/appModules/common/floor/floor'
import { doScene } from '~~/app/appModules/common/scene/scene'
import { sceneBackgroundColor } from '~~/src/Snake/Constants/colors'
import { gameSounds } from '~~/src/Snake/Constants/sounds'
import { floorTexture } from '~~/src/Snake/Constants/textures'

export namespace blasteroidController {
  export function initApp() {
    doScene(
      [15, 15],
      sceneBackgroundColor,
      gameSounds,
      new Floor(floorTexture, [0, 0], [20, 20], 2400, 2400, 100, 1)
    )
  }
}
