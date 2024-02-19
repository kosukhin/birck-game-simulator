import * as THREE from 'three'
import { TShapePosition } from '~~/src/common/types/GridTypes'

export function floor(
  texturePath: string,
  offset: TShapePosition,
  repeat: TShapePosition,
  width?: number,
  height?: number,
  widthSegments?: number,
  heightSegments?: number
) {
  let floorMesh: THREE.Mesh | undefined

  const build = async () => {
    const textureLoader = new THREE.TextureLoader()
    const texture = await textureLoader.loadAsync(texturePath)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.offset.set(...offset)
    texture.repeat.set(...repeat)
    const floorGeometry = new THREE.PlaneGeometry(
      width,
      height,
      widthSegments,
      heightSegments
    )
    const floorMaterial = new THREE.MeshStandardMaterial({
      map: texture,
    })
    floorMesh = new THREE.Mesh(floorGeometry, floorMaterial)
    floorMesh.position.set(100, -100, -4)
    return floorMesh
  }

  return {
    floorMesh,
    build,
  }
}
