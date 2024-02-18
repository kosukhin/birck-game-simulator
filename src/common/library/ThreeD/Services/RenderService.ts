import * as THREE from 'three'
import { Color, Mesh } from 'three'
import { baseSize } from '~/src/Common/Constants/Three'
import { reactOn } from '~/src/Common/Library/I'
import { Cube } from '~/src/Snake/Models'
import { FloorModel } from '~~/app/appModules/common/floor/floorModel'
import { Scene } from '~~/app/appModules/common/scene/scene'
import { EMoveDirection } from '~~/src/Common/Types/GameTypes'

export class RenderService {
  additional: number = 1
  #cubes: Record<string, THREE.Mesh> = {}
  #geometry!: THREE.BoxGeometry
  #material!: THREE.MeshPhongMaterial
  #scene!: THREE.Scene
  #camera!: THREE.Camera
  #soundListener!: THREE.AudioListener
  #sounds: Record<string, THREE.Audio> = {}
  #cameraType = 1
  #width = 400
  #height = 400
  #leadId!: string
  #cameraPointId!: string
  #leadDirection!: EMoveDirection
  #lastUpdateTime: number = 0
  #gameSpeed: number = 0
  #afterAnimate!: Function
  #afterScene?: Function

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

  get material() {
    return this.#material
  }

  get cameraPointId() {
    return this.#cameraPointId
  }

  get scene() {
    return this.#scene
  }

  render(canvasWrapper: HTMLElement) {
    const width = 400
    const height = 400
    const baseSize = 10
    this.#scene = new THREE.Scene()
    this.#afterScene && this.#afterScene()
    this.camera1()

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    })
    renderer.setSize(width, height)
    canvasWrapper.appendChild(renderer.domElement)

    const spotLight = new THREE.SpotLight(0xeeeece)
    spotLight.position.set(50, 50, 400)
    this.#scene.add(spotLight)
    const ambientLight = new THREE.AmbientLight('white', 0.5)
    this.#scene.add(ambientLight)

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
        this.additional = additional > 1 ? 1 : additional
        this.#afterAnimate.call(null, additional)
      }
      renderer.render(this.#scene, this.#camera)
    }
    animate()
  }

  afterScene(cb: Function) {
    this.#afterScene = cb
  }

  removeCube(mesh: THREE.Mesh) {
    this.#scene.remove(mesh)
    mesh.geometry.dispose()
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

  createCube(
    id: string,
    x: number,
    y: number,
    color = 0x666666,
    texture?: any
  ) {
    let material: any = this.#material.clone()
    if (texture) {
      material = new THREE.MeshStandardMaterial({
        map: texture,
      })
    } else {
      material.color = new THREE.Color(color)
    }
    const cube = new THREE.Mesh(this.#geometry, material)
    this.#scene.add(cube)
    cube.position.x = x
    cube.position.y = y
    this.#cubes[id] = cube
  }

  manageCube(id: string, x: number, y: number, color?: any, texture?: any) {
    if (this.hasCube(id)) {
      this.updateCube(id, x, y)
    } else {
      this.createCube(id, x, y, color, texture)
    }
  }

  manageCubeModel(cube: Cube) {
    if (this.hasCube(cube.id)) {
      this.updateCube(cube.id, cube.x, cube.y)
    } else {
      this.createCube(cube.id, cube.x, cube.y, Number(cube.color))
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

  removeCubeById(id: string) {
    this.removeCube(this.#cubes[id])
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

  sound(key: string, path: string, forceNew = false): Promise<THREE.Audio> {
    return new Promise((resolve) => {
      if (!this.#sounds[key]) {
        if (!this.#soundListener) {
          this.#soundListener = new THREE.AudioListener()
          this.#camera.add(this.#soundListener)
        }

        const sound = new THREE.Audio(this.#soundListener)
        const audioLoader = new THREE.AudioLoader()
        // TODO переделать на loadAsync
        audioLoader.load(path, function (buffer) {
          sound.setBuffer(buffer)
          sound.setLoop(false)
          sound.setVolume(0.1)
        })
        this.#sounds[key] = sound
      }

      const cachedSound = this.#sounds[key]

      if (forceNew && cachedSound.buffer) {
        const sound = new THREE.Audio(this.#soundListener)
        sound.setBuffer(cachedSound.buffer)
        resolve(sound)
        return
      }

      resolve(cachedSound)
    })
  }

  applySceneConfig(model: Scene) {
    reactOn(this.afterScene.bind(this), async () => {
      // TODO обработать звуки
      this.scene.background = new Color(model.background)
      this.scene.add(await this.buildFloorByModel(model.floor))
      const color = 0x2b241d
      const width = model.size[0]
      const height = model.size[1]

      for (let i = 0; i < width; i++) {
        this.createCube('t' + i, i * baseSize, 1 * baseSize, color)
        this.createCube('b' + i, i * baseSize, -height * baseSize, color)
      }

      for (let i = 0; i < height; i++) {
        this.createCube('l' + i, -1 * baseSize, -i * baseSize, color)
        this.createCube('r' + i, width * baseSize, -i * baseSize, color)
      }
    })
  }

  async buildFloorByModel(model: FloorModel): Promise<Mesh> {
    const textureLoader = new THREE.TextureLoader()
    const texture = await textureLoader.loadAsync(model.texture)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.offset.set(...model.offset)
    texture.repeat.set(...model.repeat)
    const { width, height, widthSegments, heightSegments } = model
    const floorGeometry = new THREE.PlaneGeometry(
      width,
      height,
      widthSegments,
      heightSegments
    )
    const floorMaterial = new THREE.MeshStandardMaterial({
      map: texture,
    })
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial)
    floorMesh.position.set(100, -100, -4)

    return floorMesh
  }
}
