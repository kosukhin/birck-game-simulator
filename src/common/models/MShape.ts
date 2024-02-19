import { HArray } from '~~/src/common/utils/HArray'
import { HMath } from '~~/src/common/utils/HMath'
import { EMoveDirection } from '~~/src/common/types/GameTypes'
import { TGrid, TShapePosition } from '~~/src/common/types/GridTypes'

interface IShapeParams {
  x?: number
  y?: number
  bitmap?: TGrid
  id?: any
  direction?: EMoveDirection
}

export class MShape {
  static #shapeIdCounter = 0
  #id: any = MShape.getNewShapeId()
  #bitmap: TGrid
  #x: number
  #y: number
  #direction: EMoveDirection = EMoveDirection.up
  #prevDirection: EMoveDirection = EMoveDirection.up

  constructor(params: IShapeParams) {
    const { x = 0, y = 0, bitmap = [] } = params
    this.#bitmap = bitmap
    this.#x = x
    this.#y = y

    if (params.id) {
      this.#id = params.id
    }

    if (params.direction) {
      this.#direction = params.direction
    }
  }

  get bitmap(): TGrid {
    let bitmap = this.#bitmap

    // Если у фигуры нестандартный поворот, то поворачиваем битмап
    if (this.#direction !== EMoveDirection.up) {
      this.#direction === EMoveDirection.right &&
        (bitmap = HArray.rotate90(this.#bitmap))
      this.#direction === EMoveDirection.down &&
        (bitmap = HArray.rotate180(this.#bitmap))
      this.#direction === EMoveDirection.left &&
        (bitmap = HArray.rotate270(this.#bitmap))
    }

    return bitmap
  }

  get direction() {
    return this.#direction
  }

  get prevDirection() {
    return this.#prevDirection
  }

  get position(): TShapePosition {
    return [this.#x, this.#y]
  }

  get width(): number {
    return this.#bitmap[0] && this.#bitmap[0].length
  }

  get x() {
    return this.#x
  }

  get y() {
    return this.#y
  }

  get maxX(): number {
    const xAdd = this.width - 1

    return this.x + xAdd
  }

  get maxY(): number {
    const yAdd = this.height - 1

    return this.y + yAdd
  }

  get midX(): number {
    return this.x + HMath.roundMin((this.width - 1) / 2)
  }

  get midY(): number {
    return this.y + HMath.roundMin((this.height - 1) / 2)
  }

  get id() {
    return this.#id
  }

  get height() {
    return this.#bitmap.length
  }

  static getNewShapeId() {
    MShape.#shapeIdCounter = MShape.#shapeIdCounter + 1

    return MShape.#shapeIdCounter
  }

  setDirection(direction: EMoveDirection) {
    this.#prevDirection = this.#direction
    this.#direction = direction
  }

  setBitmap(bitmap: TGrid) {
    this.#bitmap = bitmap
  }

  setPosition(position: TShapePosition) {
    ;[this.#x, this.#y] = position
  }

  setY(y: number) {
    this.#y = y
  }

  setX(x: number) {
    this.#x = x
  }

  moveY(by: number = 1) {
    this.#y += by
  }

  moveX(by: number = 1) {
    this.#x += by
  }

  isShapeEmpty() {
    let empty = true

    for (const row of this.#bitmap) {
      if (row.includes(1)) {
        empty = false
        break
      }
    }

    return empty
  }

  removePixel(x: number, y: number): boolean {
    let result = false

    if (this.#bitmap[y][x] === 1) {
      this.#bitmap[y][x] = 0
      result = true
    } else if (this.#bitmap?.[y - 1]?.[x] !== undefined) {
      result = this.removePixel(x, y - 1)
    }

    this.clearEmptyRows()

    return result
  }

  clearEmptyRows() {
    this.#bitmap.forEach((row, index) => {
      if (HArray.isAllElementsEqualsTo(row, 0)) {
        this.#bitmap.splice(index, 1)
      }
    })
  }
}
