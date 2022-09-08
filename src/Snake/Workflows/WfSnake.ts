import { Ref } from 'nuxt/dist/app/compat/capi'
import { ref } from 'vue'
import { HApp } from '~~/src/Common/Helpers/HApp'
import { HArray } from '~~/src/Common/Helpers/HArray'
import { HLog } from '~~/src/Common/Helpers/HLog'
import { useService } from '~~/src/Common/Helpers/HService'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { MShape } from '~~/src/Common/Models/MShape'
import { SConnectors } from '~~/src/Common/Services/SConnectors'
import { MoveDirection } from '~~/src/Common/Types/GameTypes'
import { Snake } from '~~/src/Snake/Library/Snake'

/**
 * Змейка логика игры
 */
export class WfSnake {
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
        this.renderNextFrame()
    }

    async renderNextFrame() {
        await HApp.wait(this.speed.value)
        useService<SConnectors>('connectors').browser.requestAnimationFrame(
            () => {
                this.snake.applyNewDirection()
                this.snake.moveForward()

                // Если змейка достигла точки
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

                !this.isGameOver.value && this.renderNextFrame()
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
        if (this.snake.direction === direction) {
            this.snake.moveForward()
            return
        }

        this.snake.changeDirection(direction)
    }

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
