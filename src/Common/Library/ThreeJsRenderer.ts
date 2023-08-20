import * as THREE from 'three'
import { MGrid } from '~/src/Common/Models/MGrid'

export class ThreeJsRenderer {
  #grid: MGrid
  #canvasWrapper: HTMLElement
  #baseSize = 10
  #spaceBetween = 5
  #rotationSpeed = 0.01

  constructor(grid: MGrid, canvasWrapper: HTMLElement) {
    this.#grid = grid
    this.#canvasWrapper = canvasWrapper
  }

  render() {
    let gridArray = this.#grid.render()

    if (!gridArray[0]) {
      return
    }

    const height =
      (gridArray.length + 1) * (this.#baseSize + this.#spaceBetween)
    const width =
      (gridArray[0].length + 1) * (this.#baseSize + this.#spaceBetween)
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      -this.#baseSize,
      1000
    )
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
    })
    renderer.setSize(width, height)
    this.#canvasWrapper.appendChild(renderer.domElement)

    const spotLight = new THREE.SpotLight(0xeeeece)
    spotLight.position.set(1000, 1000, 1000)
    scene.add(spotLight)

    const geometry = new THREE.BoxGeometry(
      this.#baseSize,
      this.#baseSize,
      this.#baseSize
    )
    const material = new THREE.MeshPhongMaterial({
      color: 0x666666,
    })
    material.flatShading = false

    const cubesGrid: any = []
    let topOffset = -1 * (this.#baseSize + this.#spaceBetween)
    let leftOffset = 0

    for (const row in gridArray) {
      gridArray[row].reverse()

      if (!cubesGrid[row]) {
        cubesGrid[row] = []
      }

      for (const cell in gridArray[row]) {
        leftOffset += this.#baseSize + this.#spaceBetween
        cubesGrid[row][cell] = new THREE.Mesh(geometry, material)
        cubesGrid[row][cell].position.x = leftOffset - width / 2
        cubesGrid[row][cell].position.y = topOffset + height / 2
        scene.add(cubesGrid[row][cell])
        cubesGrid[row][cell].visible = false
      }

      topOffset -= this.#baseSize + this.#spaceBetween
      leftOffset = 0
    }

    camera.position.z = 5
    let rotationX = 0
    let rotationY = 0

    const animate = () => {
      requestAnimationFrame(animate)
      gridArray = this.#grid.render()

      rotationX += this.#rotationSpeed
      rotationY += this.#rotationSpeed

      for (const row in gridArray) {
        for (const cell in gridArray[row]) {
          cubesGrid[row][cell].visible = false

          if (gridArray[row][cell]) {
            cubesGrid[row][cell].visible = true

            if (!cubesGrid[row][cell].rotation.x) {
              cubesGrid[row][cell].rotation.x = rotationX
              cubesGrid[row][cell].rotation.y = rotationY
            } else {
              cubesGrid[row][cell].rotation.x += this.#rotationSpeed
              cubesGrid[row][cell].rotation.y += this.#rotationSpeed
            }
          }
        }
      }

      renderer.render(scene, camera)
    }
    animate()
  }
}
