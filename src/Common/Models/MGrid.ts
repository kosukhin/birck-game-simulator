import { HArray } from '~~/src/Common/Helpers/HArray'
import { HObjects } from '~~/src/Common/Helpers/HObjects'
import { MShape } from '~~/src/Common/Models/MShape'
import { TGrid } from '~~/src/Common/Types/GridTypes'

interface IGridParams {
  height?: number
  width?: number
  bgBitmap?: TGrid
}

export class MGrid {
  #width: number
  #height: number
  #bgBitmap: TGrid
  #shapes: MShape[]

  constructor(params: IGridParams) {
    const { height = 15, width = 10, bgBitmap = [] } = params
    this.#height = height
    this.#width = width
    this.#bgBitmap = bgBitmap
    this.#shapes = []
  }

  get shapesCount(): number {
    return this.#shapes.length
  }

  get width(): number {
    return this.#width
  }

  get height(): number {
    return this.#height
  }

  get bgBitmap() {
    return this.#bgBitmap
  }

  get maxX() {
    return this.width - 1
  }

  get maxY() {
    return this.height - 1
  }

  get shapes() {
    return this.#shapes
  }

  render() {
    const grid = HObjects.clone(this.#bgBitmap) as TGrid
    const copyShapeToGrid = (shape: MShape) => {
      // Копируем фигуру на грид
      for (const i in shape.bitmap) {
        let x = Number(shape.x)
        const y = Number(shape.y)

        // Пересечение границы справа
        if (shape.maxX > this.width - 1) {
          x = this.width - shape.width
          shape.setPosition([x, y])
        }

        // Пересечение границы слева
        if (shape.x < 0) {
          x = 0
          shape.setPosition([x, y])
        }

        if (shape.y <= 0) {
          shape.setY(0)
        }

        if (shape.maxY >= this.#height - 1) {
          shape.setY(this.#height - shape.height)
        }

        // Переносим пиксели фигуры на сетку
        for (const j in shape.bitmap[i]) {
          const nextY = y + Number(i)
          const nextX = x + Number(j)

          if (!grid[nextY]) {
            continue
          }

          grid[nextY][nextX] = shape.bitmap[i][j] || grid[nextY][nextX]
        }
      }
    }

    for (const shape of this.#shapes) {
      copyShapeToGrid(shape)
    }

    return grid
  }

  setGrid(bitmap: TGrid) {
    this.#bgBitmap = bitmap
  }

  setHeight(height: number) {
    this.#height = height
  }

  setWidth(width: number) {
    this.#width = width
  }

  addRowToTop(row: number[]) {
    this.#bgBitmap.unshift(row)
  }

  removeRowByIndex(index: number) {
    this.#bgBitmap.splice(index, 1)
  }

  addShape(shape: MShape) {
    this.#shapes = [...this.#shapes, shape]
  }

  removeShapeById(id: string | number) {
    const index = this.#shapes.findIndex((shape) => shape.id === id)

    if (index !== -1) {
      this.#shapes.splice(index, 1)
    }
  }

  removeShape(shape: MShape) {
    const index = this.#shapes.indexOf(shape)

    if (index !== -1) {
      this.#shapes.splice(index, 1)
    }
  }

  hasShape(shape: MShape) {
    return this.#shapes.includes(shape)
  }

  hasShapeById(id: number) {
    return this.#shapes.findIndex((shape) => shape.id === id) !== -1
  }

  clearShapes() {
    this.#shapes = []
  }

  getFirstShape(): MShape | undefined {
    return this.#shapes[0]
  }

  getShapes(): MShape[] {
    return this.#shapes
  }

  createEmptyGrid() {
    this.#bgBitmap = HArray.createTwoDemGrid(this.#width, this.#height)
  }

  isShapeOutOfBounds(shape: MShape): boolean {
    const lessThanX = shape.x < 0
    const lessThanY = shape.y < 0
    const moreThanX = shape.x > this.width - 1
    const moreThanY = shape.y > this.height - 1

    return lessThanX || lessThanY || moreThanX || moreThanY
  }

  isShapeIntersectedWithOtherShape(shape: MShape): MShape | undefined {
    let intersected: MShape | undefined

    for (const currentShape of this.#shapes) {
      const isIntersectedByX =
        currentShape.x <= shape.x && shape.x <= currentShape.maxX
      const isIntersectedByY =
        currentShape.y <= shape.y && shape.y <= currentShape.maxY

      if (isIntersectedByX && isIntersectedByY) {
        intersected = currentShape
        break
      }
    }

    return intersected
  }
}
