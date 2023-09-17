import { HApp } from '~~/src/Common/Helpers/HApp'
import { Observable } from '~~/src/Common/Library/Observable'
import { ShapeMover } from '~~/src/Common/Library/ShapeMover'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { MShape } from '~~/src/Common/Models/MShape'
import { EMoveDirection } from '~~/src/Common/Types/GameTypes'
import { TShapePosition } from '~~/src/Common/Types/GridTypes'

const SHOOT_SPEED = 50

interface IShootParam {
  grid: MGrid
  position: TShapePosition
  direction: EMoveDirection
  fromShape: MShape
  byPixel?: boolean
}

export class Shoot {
  hitTheTarget: Observable<(target: MShape) => void>
  #grid: MGrid
  #position: TShapePosition
  #direction: EMoveDirection
  #fromShape: MShape
  #shapeMover: ShapeMover = new ShapeMover()
  #byPixel: boolean
  #id: string
  #x!: number
  #y!: number
  #isDone = false
  #willBeRemoved = false

  constructor(params: IShootParam) {
    this.#id = HApp.uniqueId()
    this.#grid = params.grid
    this.#position = params.position
    this.#direction = params.direction
    this.#fromShape = params.fromShape
    this.#byPixel = params.byPixel
    this.hitTheTarget = new Observable()
    this.run()
  }

  get id() {
    return this.#id
  }

  get x() {
    return this.#x ?? this.#position[0]
  }

  get y() {
    return this.#y ?? this.#position[1]
  }

  get isDone() {
    return this.#isDone
  }

  get willBeRemoved() {
    return this.#willBeRemoved
  }

  set willBeRemoved(willBe) {
    this.#willBeRemoved = willBe
  }

  run() {
    const direction = this.#direction
    const shootId = HApp.uniqueId('shoot')
    const shoot = new MShape({
      id: shootId,
      x: this.#position[0],
      y: this.#position[1],
      bitmap: [[1]],
    })
    this.#grid.addShape(shoot)

    const shootRenderHandler = setInterval(() => {
      this.#shapeMover.move(shoot, direction)
      this.#x = shoot.x
      this.#y = shoot.y

      // Промах
      if (this.#grid.isShapeOutOfBounds(shoot)) {
        this.#grid.removeShapeById(shootId)
        clearInterval(shootRenderHandler)
        this.#isDone = true
      }

      const intersectedShape =
        this.#grid.isShapeIntersectedWithOtherShape(shoot)

      // Попали в фигуру
      if (
        intersectedShape &&
        intersectedShape !== this.#fromShape &&
        intersectedShape !== shoot
      ) {
        this.#isDone = true
        // Разрушаем фигуру по пикселям
        if (this.#byPixel) {
          const shapeInX = shoot.x - intersectedShape.x
          const shapeInY = shoot.y - intersectedShape.y

          if (intersectedShape.removePixel(shapeInX, shapeInY)) {
            this.#grid.removeShapeById(shootId)
            clearInterval(shootRenderHandler)
            this.hitTheTarget.runSubscribers(intersectedShape)
          }
        } else {
          this.#grid.removeShapeById(shootId)
          this.#grid.removeShape(intersectedShape)
          clearInterval(shootRenderHandler)
          this.hitTheTarget.runSubscribers(intersectedShape)
        }
      }
    }, SHOOT_SPEED)
  }
}
