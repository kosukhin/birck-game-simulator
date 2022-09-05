import { Ref } from 'nuxt/dist/app/compat/capi'
import { ref } from 'vue'
import { HLog } from '~~/src/Helpers/HLog'
import { HMath } from '~~/src/Helpers/HMath'
import { MGrid } from '~~/src/Models/MGrid'
import { MShape } from '~~/src/Models/MShape'

export enum MoveDirection {
    up,
    down,
    right,
    left,
}

/**
 * Змейка логика игры
 */
export class WfMain {
    #grid: MGrid
    #snake: MShape

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
        this.#snake = new MShape({ bitmap: [[1, 1, 1]], x: 0, y: 0 })
        this.#grid.addShape(this.#snake)
    }

    run() {
        this.addTargetDot()
        this.drawSnake()
    }

    /**
     * Изменить направление движения змейки
     * @param direction
     */
    moveSnake(direction: MoveDirection) {
        const x = this.#snake.x
        const y = this.#snake.y

        if (direction === MoveDirection.left) {
            this.#snake.position = [x - 1, y]
        }

        if (direction === MoveDirection.right) {
            this.#snake.position = [x + 1, y]
        }

        if (direction === MoveDirection.down) {
            this.#snake.position = [x, y + 1]
        }

        if (direction === MoveDirection.up) {
            this.#snake.position = [x, y - 1]
        }

        HLog.log('snake', this.#snake.position)
        this.#updateCounter.value++
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
        const dot = new MShape({ bitmap: [[1]] })
        const x = HMath.random(3, this.#grid.width - 1)
        const y = HMath.random(1, this.#grid.height - 1)
        dot.position = [x, y]
        this.#grid.addShape(dot)
        HLog.log('snake', dot.position)
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
