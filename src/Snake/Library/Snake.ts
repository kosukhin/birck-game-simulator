import { HArray } from '~~/src/Common/Helpers/HArray'
import { HObjects } from '~~/src/Common/Helpers/HObjects'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { MShape } from '~~/src/Common/Models/MShape'
import {
    EMoveDirection,
    ReverseDirections,
} from '~~/src/Common/Types/GameTypes'
import { SnakePoint } from '~~/src/Snake/Library/SnakePoint'

/**
 * Абстрацкция змейки
 */
export class Snake {
    /** Первая точка змейки */
    #leadPoint: SnakePoint
    /** Хвост змейки  */
    #points: SnakePoint[] = []
    /** Направление движения змейки */
    #direction: EMoveDirection = EMoveDirection.right
    /** Следующее направление которое возможно будет применено */
    #newDirection: EMoveDirection = EMoveDirection.right
    /** Фигура змейки */
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

    /**
     * Двигает змейку вперед
     */
    moveForward() {
        // Коориднаты каждой предыдущей точки хвоста копируем в следующую
        let prevPointPosition = [this.#leadPoint.x, this.#leadPoint.y]

        switch (this.#direction) {
            case EMoveDirection.down:
                this.#leadPoint.setPosition(
                    this.#leadPoint.x,
                    this.#leadPoint.y + 1
                )
                break
            case EMoveDirection.up:
                this.#leadPoint.setPosition(
                    this.#leadPoint.x,
                    this.#leadPoint.y - 1
                )
                break
            case EMoveDirection.right:
                this.#leadPoint.setPosition(
                    this.#leadPoint.x + 1,
                    this.#leadPoint.y
                )
                break
            case EMoveDirection.left:
                this.#leadPoint.setPosition(
                    this.#leadPoint.x - 1,
                    this.#leadPoint.y
                )
                break
        }

        this.#points.forEach((point) => {
            const position = [point.x, point.y]
            point.setPosition(prevPointPosition[0], prevPointPosition[1])
            prevPointPosition = position
        })

        this.updateShape()
    }

    /**
     * Добавляет новую точку в тело змейки
     */
    addPointToEnd() {
        const lastPoint = this.#points[this.#points.length - 1]
        this.#points.push(new SnakePoint(lastPoint.x, lastPoint.y))
        this.updateShape()
    }

    /**
     * Обновляем битмап фигуры Mshape
     */
    updateShape() {
        const bitmap = HArray.createTwoDemGrid(
            this.#shape.width,
            this.#shape.height
        )
        const points = [this.#leadPoint, ...this.#points]

        points.forEach((point) => {
            if (bitmap?.[point.y]?.[point.x] !== undefined) {
                bitmap[point.y][point.x] = 1
            }
        })

        this.#shape.setBitmap(bitmap)
    }

    /**
     * Изменяет направление движения змейки, запоминает только
     * новое направление, оно будет применено после вызова
     * applyDirection метода
     * @param direction
     */
    changeDirection(direction: EMoveDirection) {
        this.#newDirection = direction
    }

    applyNewDirection() {
        // Если пользователь нажал противоположное направление - игнорируем
        if (this.isReverseDirection(this.#newDirection)) {
            return
        }

        this.#direction = this.#newDirection
    }

    /**
     * Определяет является ли направление противоположным
     * @param direction
     */
    isReverseDirection(direction: EMoveDirection) {
        const reverseDirection = ReverseDirections[this.#direction]

        return reverseDirection === direction
    }

    /**
     * Змейка вышла за границы
     */
    isSnakeOutOfBounds() {
        const lessThanX = this.#leadPoint.x < 0
        const lessThanY = this.#leadPoint.y < 0
        const moreThanX = this.#leadPoint.x > this.#shape.width - 1
        const moreThanY = this.#leadPoint.y > this.#shape.height - 1

        return lessThanX || lessThanY || moreThanX || moreThanY
    }

    /**
     * Змейка съела сама себя, если координата
     * лидирующей точки совпала с хотябы одной точкой хвоста
     */
    isSnakeAteItSelf() {
        let isAte = false

        this.#points.forEach((point) => {
            if (
                point.x === this.#leadPoint.x &&
                point.y === this.#leadPoint.y
            ) {
                isAte = true
            }
        })

        return isAte
    }
}
