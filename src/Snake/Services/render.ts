import { RenderService } from '~/src/Common/Library/ThreeD/Services/RenderService'
import { Cube } from '~/src/Snake/Models'

export function oManageCube(rserv: RenderService, cube: Cube) {
  rserv.manageCubeModel(cube)
}
