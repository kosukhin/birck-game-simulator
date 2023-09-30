import * as THREE from 'three'
import { TShapePosition } from '~~/src/Common/Types/GridTypes'

export class Floor {
  private floorMesh?: THREE.Mesh

  // eslint-disable-next-line no-useless-constructor
  constructor(
    readonly texturePath: string,
    readonly offset: TShapePosition,
    readonly repeat: TShapePosition,
    readonly width?: number,
    readonly height?: number,
    readonly widthSegments?: number,
    readonly heightSegments?: number
  ) {}

  async build() {
    const textureLoader = new THREE.TextureLoader()
    const texture = await textureLoader.loadAsync(this.texturePath)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.offset.set(...this.offset)
    texture.repeat.set(...this.repeat)
    const floorGeometry = new THREE.PlaneGeometry(
      this.width,
      this.height,
      this.widthSegments,
      this.heightSegments
    )
    const floorMaterial = new THREE.MeshStandardMaterial({
      map: texture,
    })
    this.floorMesh = new THREE.Mesh(floorGeometry, floorMaterial)
    this.floorMesh.position.set(100, -100, -4)
    return this
  }

  mesh(): THREE.Mesh {
    return this.floorMesh as THREE.Mesh
  }
}
