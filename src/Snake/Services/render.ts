import { RenderService } from '~/src/Common/Library/ThreeD/Services/RenderService'
import { Cube } from '~/src/Snake/Models'

export function oManageCube(rserv: RenderService, cube: Cube) {
  rserv.manageCubeModel(cube)
}

export function oSetLeadId(rserv: RenderService, id: string) {
  rserv.setLeadId(id)
}

export function oOnTick(
  rserv: RenderService,
  cb: (additional: number) => void
) {
  rserv.setAfterAnimate(cb)
}
