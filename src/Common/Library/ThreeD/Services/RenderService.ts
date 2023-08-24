import * as THREE from 'three'
import { EMoveDirection } from '~~/src/Common/Types/GameTypes'

export class RenderService {
  #cubes: Record<string, THREE.Mesh> = {}
  #geometry!: THREE.BoxGeometry
  #material!: THREE.MeshPhongMaterial
  #scene!: THREE.Scene
  #camera!: THREE.Camera
  #cameraType = 1
  #width = 400
  #height = 400
  #leadId!: string
  #cameraPointId!: string
  #leadDirection!: EMoveDirection
  #lastUpdateTime!: number = 0
  #gameSpeed!: number = 0
  #afterAnimate!: Function

  render(canvasWrapper: HTMLElement) {
    const width = 400
    const height = 400
    const baseSize = 10
    this.#scene = new THREE.Scene()
    this.camera1()

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
      if (this.#afterAnimate) {
        const delta = new Date().getTime() - this.#lastUpdateTime
        const speed = this.#gameSpeed
        const additional = (100 * delta) / speed / 100
        this.#afterAnimate.call(null, additional)
      }
      renderer.render(this.#scene, this.#camera)
    }
    animate()
  }

  removeCube(mesh: THREE.Mesh) {
    this.#scene.remove(mesh)
    mesh.geometry.dispose()
  }

  get camera() {
    return this.#camera
  }

  get cameraType() {
    return this.#cameraType
  }

  get cubes() {
    return this.#cubes
  }

  get leadId() {
    return this.#leadId
  }

  get cameraPointId() {
    return this.#cameraPointId
  }

  camera1() {
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 250
    const k = 0.9
    camera.position.x = (camera.position.z / 2) * k
    camera.position.y = (-camera.position.z / 2) * k
    this.#camera = camera
    this.#cameraType = 1
  }

  camera3(fav = 75, z = 30) {
    const camera = new THREE.PerspectiveCamera(fav, 1, 0.1, 1000)
    camera.position.z = z

    this.#camera = camera
    this.#cameraType = 3
  }

  calculateCameraPosition() {
    if (this.#cameraType !== 3) {
      return
    }

    const leadPoint = this.#cubes[this.#leadId]
    const cameraPoint = this.#cubes[this.#cameraPointId]
    const temp = new THREE.Vector3()
    temp.setFromMatrixPosition(cameraPoint.matrixWorld)
    this.#camera.position.lerp(temp, 0.2)
    this.#camera.position.z += 8
    this.#camera.lookAt(leadPoint.position)
  }

  camera2() {
    const camera = new THREE.OrthographicCamera(
      -20,
      this.#width - 10,
      20,
      -this.#height,
      -10,
      10
    )
    camera.position.z = 15
    this.#camera = camera
    this.#cameraType = 2
  }

  createCube(id: string, x: number, y: number, color = 0x666666) {
    const material = this.#material.clone()
    material.color = new THREE.Color(color)
    const cube = new THREE.Mesh(this.#geometry, material)
    this.#scene.add(cube)
    cube.position.x = x
    cube.position.y = y
    this.#cubes[id] = cube
  }

  manageCube(id: string, x: number, y: number, color?: number) {
    if (this.hasCube(id)) {
      this.updateCube(id, x, y)
    } else {
      this.createCube(id, x, y, color)
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

  setLeadId(leadId: string) {
    this.#leadId = leadId
  }

  setCameraPointId(cameraPId: string) {
    this.#cameraPointId = cameraPId
  }

  setLeadDirection(leadDirection: EMoveDirection) {
    this.#leadDirection = leadDirection
  }

  setLastUpdateTime(lastUpdate: number) {
    this.#lastUpdateTime = lastUpdate
  }

  setGameSpeed(speed: number) {
    this.#gameSpeed = speed
  }

  setAfterAnimate(afterAnimate: Function) {
    this.#afterAnimate = afterAnimate
  }
}
