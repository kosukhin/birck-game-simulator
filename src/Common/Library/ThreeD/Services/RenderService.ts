import * as THREE from 'three'
import { Cube } from '~~/src/Common/Library/ThreeD/Entities/Cube'

export class RenderService {
  #cubes: Record<string, Cube> = {}

  render(canvasWrapper: HTMLElement) {
    const width = 400
    const height = 400
    const baseSize = 10
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      -baseSize,
      1000
    )
    camera.position.z = 5
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
    })
    renderer.setSize(width, height)
    canvasWrapper.appendChild(renderer.domElement)

    const spotLight = new THREE.SpotLight(0xeeeece)
    spotLight.position.set(1000, 1000, 1000)
    scene.add(spotLight)

    const geometry = new THREE.BoxGeometry(baseSize, baseSize, baseSize)

    const material = new THREE.MeshPhongMaterial({
      color: 0x666666,
    })
    material.flatShading = false

    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()
  }

  createCube(id: string, x: number, y: number) {
    this.#cubes[id] = new Cube(x, y)
  }

  hasCube(id: string) {
    return !!this.#cubes[id]
  }

  updateCube(id: string, x: number, y: number) {
    const cube = this.#cubes[id]

    if (cube) {
      cube.setPosition(x, y)
    }
  }
}
