import { Ref } from 'nuxt/dist/app/compat/capi'
import { ref } from 'vue'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { WfTetrisConditions } from '~~/src/Tetris/Workflows/WfTetrisConditions'
import { Shapes } from '~~/src/Tetris/Data/Shapes'
import { MShape } from '~~/src/Common/Models/MShape'
import { HApp } from '~~/src/Common/Helpers/HApp'
import { HObjects } from '~~/src/Common/Helpers/HObjects'
import { useService } from '~~/src/Common/Helpers/HService'
import { SConnectors } from '~~/src/Common/Services/SConnectors'
import { HArray } from '~~/src/Common/Helpers/HArray'
import { IGameWorkflow } from '~~/src/Common/Types/GameTypes'

/**
 * Основной класс хода выполнения игры тетрис
 */
export class WfTetris implements IGameWorkflow {
    /** Основная сетка тетриса */
    #grid: MGrid
    /** Счет игры */
    #score: Ref<number>
    /** Скорость падения блоков */
    #speed: Ref<number>
    /** Флаг игра закончена */
    #isGameOver: Ref<boolean>
    /** Условия игры */
    #conditions: WfTetrisConditions
    /** Флаг остановлена игра или нет */
    #isPaused: boolean

    constructor() {
        this.#grid = new MGrid({})
        this.#grid.createEmptyGrid()
        this.#conditions = new WfTetrisConditions(this.#grid)
        this.#score = ref(0)
        this.#speed = ref(500)
        this.#isGameOver = ref(false)
    }

    get isGameOver() {
        return this.#isGameOver
    }

    get grid(): MGrid {
        return this.#grid
    }

    get score() {
        return this.#score
    }

    get speed() {
        return this.#speed
    }

    /**
     * Запускает работу тетриса
     */
    async run() {
        await HApp.wait(this.#speed.value)
        useService<SConnectors>('connectors').browser.requestAnimationFrame(
            () => {
                if (this.#isPaused) {
                    return
                }

                this.renderNextFrame()

                if (!this.#conditions.checkGameOver()) {
                    this.run()
                } else {
                    this.#isGameOver.value = true
                }
            }
        )
    }

    /**
     * {@inheritDoc IGameWorkflow}
     */
    pause() {
        if (this.#isPaused) {
            this.#isPaused = false
            this.run()
        } else {
            this.#isPaused = true
        }
    }

    /**
     * Рендерит следующий фрейм игры
     */
    renderNextFrame() {
        const grid = this.#grid.render()
        let shape = this.#grid.getFirstShape()

        if (!shape) {
            this.addRandomShapeToGrid()
            shape = this.#grid.getFirstShape()
        }

        const canMove = this.#conditions.canShapeMoveNext()

        if (!canMove) {
            this.#grid.setGrid(grid)
            this.#grid.clearShapes()
            const filledLineIndexes = this.#conditions.checkLinesFilled()

            if (filledLineIndexes.length) {
                for (const index of filledLineIndexes) {
                    this.#grid.removeRowByIndex(Number(index))
                    this.#grid.addRowToTop(
                        HArray.createEmptyRow(this.#grid.width)
                    )
                    this.#score.value += 1
                    this.#speed.value -= 10
                }
            }
        }

        if (shape && canMove) {
            shape.moveY()
        }
    }

    /**
     * Добавляет на сетку игры новую рандомную
     * фигуру, в центр сетки
     */
    addRandomShapeToGrid() {
        const index = Math.round(Math.random() * (Shapes.length - 1))
        const bitmap = HObjects.clone(Shapes[index])
        const shape = new MShape({ bitmap })
        const { round } = Math
        shape.setPosition([
            round(this.#grid.width / 2) - round(shape.width / 2),
            -1,
        ])
        this.#grid.clearShapes()
        this.#grid.addShape(shape)
    }

    /**
     * Перемещает фигуру по x
     * @param xOffset
     */
    moveShapeByX(xOffset: number) {
        if (this.#conditions.checkShapeIntersection({ x: xOffset })) {
            return
        }

        const shape = this.grid.getFirstShape()
        shape.moveX(xOffset)
    }

    /**
     * Перемещает фигуру вниз с проверкой возможности перемещения
     */
    moveShapeDown() {
        if (!this.#conditions.canShapeMoveNext()) {
            return
        }

        const shape = this.grid.getFirstShape()
        shape.moveY(1)
    }
}
