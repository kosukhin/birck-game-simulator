import * as THREE from 'three'

export class RenderService {
  #cubes: Record<string, THREE.Mesh> = {}
  #geometry!: THREE.BoxGeometry
  #material!: THREE.MeshPhongMaterial
  #scene!: THREE.Scene

  render(canvasWrapper: HTMLElement) {
    const width = 400
    const height = 400
    const baseSize = 10
    this.#scene = new THREE.Scene()
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
    this.#scene.add(spotLight)

    this.#geometry = new THREE.BoxGeometry(baseSize, baseSize, baseSize)
    this.#material = new THREE.MeshPhongMaterial({
      color: 0x666666,
    })
    this.#material.flatShading = false

    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(this.#scene, camera)
    }
    animate()
  }

  createCube(id: string, x: number, y: number) {
    const cube = new THREE.Mesh(this.#geometry, this.#material)
    this.#scene.add(cube)
    cube.position.x = x
    cube.position.y = y
    this.#cubes[id] = cube
  }

  manageCube(id: string, x: number, y: number) {
    if (this.hasCube(id)) {
      this.updateCube(id, x, y)
    } else {
      this.createCube(id, x, y)
    }
  }

  getPosition(id: string) {
    if (!this.hasCube(id)) {
      return { x: 0, y: 0 }
    }
    const cube = this.#cubes[id]
    return {
      x: cube.position.x,
      y: cube.position.y,
    }
  }

  hasCube(id: string) {
    return !!this.#cubes[id]
  }

  updateCube(id: string, x: number, y: number) {
    const cube = this.#cubes[id]

    if (cube) {
      cube.position.x = x
      cube.position.y = y
    }
  }
}
