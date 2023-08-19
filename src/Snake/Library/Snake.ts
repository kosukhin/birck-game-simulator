import { HArray } from '~~/src/Common/Helpers/HArray'
import { HObjects } from '~~/src/Common/Helpers/HObjects'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { MShape } from '~~/src/Common/Models/MShape'
import {
  EMoveDirection,
  ReverseDirections,
} from '~~/src/Common/Types/GameTypes'
import { SnakePoint } from '~~/src/Snake/Library/SnakePoint'

export class Snake {
  #leadPoint: SnakePoint
  #points: SnakePoint[] = []
  #direction: EMoveDirection = EMoveDirection.right
  #newDirection: EMoveDirection = EMoveDirection.right
  #shape: MShape

  constructor(grid: MGrid) {
    this.#shape = new MShape({
      bitmap: HObjects.clone(grid.bgBitmap),
    })
    this.#leadPoint = new SnakePoint(2, 0)
    this.#points = [new SnakePoint(1, 0), new SnakePoint(0, 0)]
    this.updateShape()
  }

  get leadPoint() {
    return this.#leadPoint
  }

  get points() {
    return this.#points
  }

  get direction() {
    return this.#direction
  }

  get shape() {
    return this.#shape
  }

  moveForward() {
    let prevPointPosition = [this.#leadPoint.x, this.#leadPoint.y]

    switch (this.#direction) {
    case EMoveDirection.down:
      this.#leadPoint.setPosition(this.#leadPoint.x, this.#leadPoint.y + 1)
      break
    case EMoveDirection.up:
      this.#leadPoint.setPosition(this.#leadPoint.x, this.#leadPoint.y - 1)
      break
    case EMoveDirection.right:
      this.#leadPoint.setPosition(this.#leadPoint.x + 1, this.#leadPoint.y)
      break
    case EMoveDirection.left:
      this.#leadPoint.setPosition(this.#leadPoint.x - 1, this.#leadPoint.y)
      break
    }

    this.#points.forEach((point) => {
      const position = [point.x, point.y]
      point.setPosition(prevPointPosition[0], prevPointPosition[1])
      prevPointPosition = position
    })

    this.updateShape()
  }

  addPointToEnd() {
    const lastPoint = this.#points[this.#points.length - 1]
    this.#points.push(new SnakePoint(lastPoint.x, lastPoint.y))
    this.updateShape()
  }

  updateShape() {
    const bitmap = HArray.createTwoDemGrid(
      this.#shape.width,
      this.#shape.height
    ) as Array<Array<number>>
    const points = [this.#leadPoint, ...this.#points]

    points.forEach((point) => {
      if (bitmap?.[point.y]?.[point.x] !== undefined) {
        bitmap[point.y][point.x] = 1
      }
    })

    this.#shape.setBitmap(bitmap)
  }

  changeDirection(direction: EMoveDirection) {
    this.#newDirection = direction
  }

  applyNewDirection() {
    if (this.isReverseDirection(this.#newDirection)) {
      return
    }

    this.#direction = this.#newDirection
  }

  isReverseDirection(direction: EMoveDirection) {
    const reverseDirection = ReverseDirections[this.#direction]

    return reverseDirection === direction
  }

  isSnakeOutOfBounds() {
    const lessThanX = this.#leadPoint.x < 0
    const lessThanY = this.#leadPoint.y < 0
    const moreThanX = this.#leadPoint.x > this.#shape.width - 1
    const moreThanY = this.#leadPoint.y > this.#shape.height - 1

    return lessThanX || lessThanY || moreThanX || moreThanY
  }

  isSnakeAteItSelf() {
    let isAte = false

    this.#points.forEach((point) => {
      if (point.x === this.#leadPoint.x && point.y === this.#leadPoint.y) {
        isAte = true
      }
    })

    return isAte
  }
}
