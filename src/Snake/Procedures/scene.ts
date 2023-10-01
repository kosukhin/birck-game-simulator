import { Color } from 'three'
import { floor } from '~~/src/Common/Library/ThreeD/Entities/Floor'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'

export async function useSceneInitProcedure(rserv: RenderService) {
  rserv.scene.background = new Color('skyblue')
  const floorMesh = await floor(
    '/images/textures/grass2.jpg',
    [0, 0],
    [20, 20],
    2400,
    2400,
    100,
    1
  ).build()
  rserv.scene.add(floorMesh)
}
