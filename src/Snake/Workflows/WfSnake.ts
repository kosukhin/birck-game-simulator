import { Ref } from 'nuxt/dist/app/compat/capi'
import { ref } from 'vue'
import { HApp } from '~~/src/Common/Helpers/HApp'
import { HArray } from '~~/src/Common/Helpers/HArray'
import { HLog } from '~~/src/Common/Helpers/HLog'
import { HMath } from '~~/src/Common/Helpers/HMath'
import { useService } from '~~/src/Common/Helpers/HService'
import { Observable } from '~~/src/Common/Library/Observable'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { MShape } from '~~/src/Common/Models/MShape'
import { SConnectors } from '~~/src/Common/Services/SConnectors'
import { EMoveDirection, IGameWorkflow } from '~~/src/Common/Types/GameTypes'
import { Snake } from '~~/src/Snake/Library/Snake'

/**
 * Змейка логика игры
 */
export class WfSnake implements IGameWorkflow {
    /** Основная сетка игры */
    #grid: MGrid
    /** Асбракция змейки */
    #snake: Snake
    /** Точка которую нужно съесть */
    #target: MShape
    /** Флаг что игра закончена */
    #isGameOver: Ref<boolean>
    /** Счет игры */
    #score: Ref<number>
    /** Скорость движения змейки */
    #speed: Ref<number>
    /** Флаг остановлена игра или нет */
    #isPaused: boolean
    /** Событие после рендеринга фрейма */
    afterFrameRendered = new Observable<() => void>()

    constructor() {
        this.#grid = new MGrid({
            height: 15,
            width: 15,
        })
        this.#grid.createEmptyGrid()
        this.#snake = new Snake(this.#grid)
        this.#grid.addShape(this.#snake.shape)
        this.#isGameOver = ref(false)
        this.#speed = ref(400)
        this.#score = ref(0)
    }

    get grid(): MGrid {
        return this.#grid
    }

    get snake(): Snake {
        return this.#snake
    }

    get score() {
        return this.#score
    }

    get speed() {
        return this.#speed
    }

    get isGameOver() {
        return this.#isGameOver
    }

    /**
     * Запускает игру змейка
     */
    run() {
        this.addTargetDot()
        this.renderNextFrame()
    }

    /**
     * {@inheritDoc IGameWorkflow}
     */
    pause() {
        if (this.#isPaused) {
            this.#isPaused = false
            this.renderNextFrame()
        } else {
            this.#isPaused = true
        }
    }

    /**
     * Рендерит новый фрейм игры
     */
    async renderNextFrame() {
        await HApp.wait(this.#speed.value)
        useService<SConnectors>('connectors').browser.requestAnimationFrame(
            () => {
                if (this.#isPaused) {
                    return
                }

                this.#snake.applyNewDirection()
                this.#snake.moveForward()

                // Если змейка достигла точки
                if (
                    this.#snake.leadPoint.x === this.#target.x &&
                    this.#snake.leadPoint.y === this.#target.y
                ) {
                    this.addTargetDot()
                    this.#snake.addPointToEnd()
                    this.#score.value++
                    this.#speed.value -= 10
                }

                // Если змейка вышла за границы - конец игры
                if (this.#snake.isSnakeOutOfBounds()) {
                    this.#isGameOver.value = true
                    return
                }

                // Змейка сама себя съела - конец игры
                if (this.#snake.isSnakeAteItSelf()) {
                    this.#isGameOver.value = true
                    return
                }

                !this.#isGameOver.value && this.renderNextFrame()
                this.afterFrameRendered.runSubscribers()
            }
        )
    }

    /**
     * Устанавливает флаг что игра завершена
     */
    setGameOver() {
        this.#isGameOver.value = true
    }

    /**
     * Изменяет направление движения змейки
     * @param direction
     */
    moveSnake(direction: EMoveDirection) {
        this.#snake.changeDirection(direction)
    }

    /**
     * Добавляет на сетку точку за которой нужно двигаться
     * змейке
     */
    addTargetDot() {
        const { x, y } = this.findRandomEmptyCoordinate()
        this.#grid.removeShapeById('target')
        this.#target = new MShape({ id: 'target', bitmap: [[1]] })
        this.#target.setPosition([x, y])
        this.#grid.addShape(this.#target)
        HLog.log('snake', this.#target.position)
    }

    /**
     * Находит рандомные координаты в которых нету заполненной точки
     */
    findRandomEmptyCoordinate(): { x: number; y: number } {
        const gridBitmap = this.#grid.render()
        const emptyCoordinates = []
        const minOffset = 2

        gridBitmap.forEach((row, y) => {
            row.forEach((cell, x) => {
                const xOffset = HMath.abs(this.#snake.leadPoint.x - Number(x))
                const yOffset = HMath.abs(this.#snake.leadPoint.y - Number(y))

                if (!cell && xOffset > minOffset && yOffset > minOffset) {
                    emptyCoordinates.push({ x, y })
                }
            })
        })

        return emptyCoordinates.length
            ? HArray.shuffle(emptyCoordinates)[0]
            : { x: 0, y: 0 }
    }
}
