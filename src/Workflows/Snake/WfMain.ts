import { Ref } from 'nuxt/dist/app/compat/capi'
import { ref } from 'vue'
import { HArray } from '~~/src/Helpers/HArray'
import { HLog } from '~~/src/Helpers/HLog'
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
 * Противоположные направления движения
 */
const ReverseDirections = {
    [MoveDirection.up]: MoveDirection.down,
    [MoveDirection.down]: MoveDirection.up,
    [MoveDirection.right]: MoveDirection.left,
    [MoveDirection.left]: MoveDirection.right,
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
            if (bitmap?.[point.y]?.[point.x] !== undefined) {
                bitmap[point.y][point.x] = 1
            }
        })

        this.shape.bitmap = bitmap
    }

    /**
     * Изменяет направление движения змейки
     * @param direction
     */
    changeDirection(direction: MoveDirection) {
        // Если пользователь нажал противоположное направление - игнорируем
        if (this.isReverseDirection(direction)) {
            return
        }

        this.direction = direction
    }

    /**
     * Определяет является ли направление противоположным
     * @param direction
     */
    isReverseDirection(direction: MoveDirection) {
        const reverseDirection = ReverseDirections[this.direction]

        return reverseDirection === direction
    }

    /**
     * Змейка вышла за границы
     */
    isSnakeOutOfBounds() {
        const lessThanX = this.leadPoint.x < 0
        const lessThanY = this.leadPoint.y < 0
        const moreThanX = this.leadPoint.x > this.width - 1
        const moreThanY = this.leadPoint.y > this.height - 1

        return lessThanX || lessThanY || moreThanX || moreThanY
    }

    /**
     * Змейка съела сама себя, если координата
     * лидирующей точки совпала с хотябы одной точкой хвоста
     */
    isSnakeAteItSelf() {
        let isAte = false

        this.points.forEach((point) => {
            if (point.x === this.leadPoint.x && point.y === this.leadPoint.y) {
                isAte = true
            }
        })

        return isAte
    }
}

/**
 * Змейка логика игры
 */
export class WfMain {
    #grid: MGrid
    snake: Snake
    target: MShape
    isGameOver: Ref<boolean>
    score: Ref<number>
    speed: Ref<number>

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
        this.isGameOver = ref(false)
        this.speed = ref(400)
        this.score = ref(0)
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
                        this.score.value++
                        this.speed.value -= 10
                    }

                    this.#updateCounter.value++

                    // Если змейка вышла за границы - конец игры
                    if (this.snake.isSnakeOutOfBounds()) {
                        this.isGameOver.value = true
                        return
                    }

                    // Змейка сама себя съела
                    if (this.snake.isSnakeAteItSelf()) {
                        this.isGameOver.value = true
                        return
                    }

                    !this.isGameOver.value && this.nextFrame()
                }, this.speed.value)
            }
        )
    }

    gameIsOver() {
        this.isGameOver.value = true
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
        const { x, y } = this.findRandomEmptyCoordinate()
        this.target.position = [x, y]
        this.#grid.addShape(this.target)
        HLog.log('snake', this.target.position)
    }

    /**
     * Найти рандомные координаты в которых нету заполненной точки
     */
    findRandomEmptyCoordinate(): { x: number; y: number } {
        const gridBitmap = this.#grid.render()
        const emptyCoordinates = []

        gridBitmap.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (!cell) {
                    emptyCoordinates.push({ x, y })
                }
            })
        })

        return emptyCoordinates.length
            ? HArray.shuffleArray(emptyCoordinates)[0]
            : { x: 0, y: 0 }
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
