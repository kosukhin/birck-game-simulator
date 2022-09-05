import { Ref } from 'nuxt/dist/app/compat/capi'
import { ref } from 'vue'
import { HArray } from '~~/src/Helpers/HArray'
import { HLog } from '~~/src/Helpers/HLog'
import { HMath } from '~~/src/Helpers/HMath'
import { HObjects } from '~~/src/Helpers/HObjects'
import { useService } from '~~/src/Helpers/HService'
import { MGrid } from '~~/src/Models/MGrid'
import { MShape } from '~~/src/Models/MShape'
import { SConnectors } from '~~/src/Services/SConnectors'

export enum MoveDirection {
    up,
    down,
    right,
    left,
}

/**
 * Одна точка теля змейки
 */
class SnakePoint {
    x = 0
    y = 0

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    setPosition(x: number, y: number) {
        this.x = x
        this.y = y
    }
}

/**
 * Абстрацкция змеи
 */
class Snake {
    // Первая точка змейки
    leadPoint: SnakePoint
    // Хвост змейки
    points: SnakePoint[] = []
    direction: MoveDirection = MoveDirection.right
    shape: MShape
    width: number
    height: number

    constructor(grid: MGrid) {
        this.shape = new MShape({
            bitmap: HObjects.clone(grid.bgBitmap),
        })
        this.leadPoint = new SnakePoint(2, 0)
        this.points = [new SnakePoint(1, 0), new SnakePoint(0, 0)]
        this.width = grid.width
        this.height = grid.height
        this.updateShape()
    }

    /**
     * Двигает змейку вперед
     */
    moveForward() {
        // Коориднаты каждой предыдущей точки хвоста копируем в следующую
        let prevPointPosition = [this.leadPoint.x, this.leadPoint.y]

        switch (this.direction) {
            case MoveDirection.down:
                this.leadPoint.setPosition(
                    this.leadPoint.x,
                    this.leadPoint.y + 1
                )
                break
            case MoveDirection.up:
                this.leadPoint.setPosition(
                    this.leadPoint.x,
                    this.leadPoint.y - 1
                )
                break
            case MoveDirection.right:
                this.leadPoint.setPosition(
                    this.leadPoint.x + 1,
                    this.leadPoint.y
                )
                break
            case MoveDirection.left:
                this.leadPoint.setPosition(
                    this.leadPoint.x - 1,
                    this.leadPoint.y
                )
                break
        }

        this.points.forEach((point) => {
            const position = [point.x, point.y]
            point.setPosition(prevPointPosition[0], prevPointPosition[1])
            prevPointPosition = position
        })

        this.updateShape()
    }

    addPointToEnd() {
        const lastPoint = this.points[this.points.length - 1]
        this.points.push(new SnakePoint(lastPoint.x, lastPoint.y))
        this.updateShape()
    }

    /**
     * Обновляем битмап фигуры Mshape
     */
    updateShape() {
        const bitmap = HArray.createTwoDemGrid(this.width, this.height)
        const points = [this.leadPoint, ...this.points]

        points.forEach((point) => {
            bitmap[point.y][point.x] = 1
        })

        this.shape.bitmap = bitmap
    }

    /**
     * Изменяет направление движения змейки
     * @param direction
     */
    changeDirection(direction: MoveDirection) {
        this.direction = direction
    }
}

/**
 * Змейка логика игры
 */
export class WfMain {
    #grid: MGrid
    snake: Snake
    target: MShape
    isGameOver = false

    /**
     * Счетчик необходимый для формирования ключа обновления сетки
     */
    #updateCounter: Ref<number>

    constructor() {
        this.#grid = new MGrid({
            height: 15,
            width: 15,
        })
        this.#grid.createEmptyGrid()
        this.#updateCounter = ref(0)
        this.snake = new Snake(this.#grid)
        this.#grid.addShape(this.snake.shape)
    }

    run() {
        this.addTargetDot()
        this.drawSnake()
        this.nextFrame()
    }

    nextFrame() {
        useService<SConnectors>('connectors').browser.requestAnimationFrame(
            () => {
                setTimeout(() => {
                    this.snake.moveForward()

                    /**
                     * Если змейка достигла точки
                     */
                    if (
                        this.snake.leadPoint.x === this.target.x &&
                        this.snake.leadPoint.y === this.target.y
                    ) {
                        this.snake.addPointToEnd()
                        this.addTargetDot()
                        this.snake.moveForward()
                    }

                    this.#updateCounter.value++
                    !this.isGameOver && this.nextFrame()
                }, 400)
            }
        )
    }

    gameIsOver() {
        this.isGameOver = true
    }

    /**
     * Изменить направление движения змейки
     * @param direction
     */
    moveSnake(direction: MoveDirection) {
        this.snake.changeDirection(direction)
    }

    /**
     * Рисует змею на сетке
     */
    drawSnake() {}

    /**
     * Добавляет на сетку точку за которой нужно двигаться
     * змейке
     */
    addTargetDot() {
        this.#grid.removeShapeById('target')
        this.target = new MShape({ id: 'target', bitmap: [[1]] })
        const x = HMath.random(3, this.#grid.width - 1)
        const y = HMath.random(1, this.#grid.height - 1)
        this.target.position = [x, y]
        this.#grid.addShape(this.target)
        HLog.log('snake', this.target.position)
    }

    /**
     * Отдаем сетку на рендеринг из этого процесса
     */
    get grid(): MGrid {
        return this.#grid
    }

    /**
     * Отдает счетчик обновления интерфейса
     */
    get updateCounter() {
        return this.#updateCounter
    }
}
