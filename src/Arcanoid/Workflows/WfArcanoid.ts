import { Ref } from 'nuxt/dist/app/compat/capi'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { EMoveDirection, IGameWorkflow } from '~~/src/Common/Types/GameTypes'
import { MShape } from '~~/src/Common/Models/MShape'
import { Shapes } from '~~/src/Arcanoid/Data/Shapes'
import { Shoot } from '~~/src/Common/Library/Shoot'
import { HMath } from '~~/src/Common/Helpers/HMath'
import { TGrid } from '~~/src/Common/Types/GridTypes'

/**
 * Класс игры Арканоид
 */
export class WfArcanoid implements IGameWorkflow {
    /** Основная сетка игры */
    #grid: MGrid
    /** Фигуры арканоида */
    #arcanoid: MShape
    /** Флаг что игра закончена */
    #isGameOver: Ref<boolean>
    /** Счет игры */
    #score: Ref<number>
    /** Скорость движения змейки */
    #speed: Ref<number>
    /** Флаг остановлена игра или нет */
    #isPaused: boolean
    /** Последний выстрел */
    #lastShoot: Shoot

    constructor() {
        this.#grid = new MGrid({
            height: 20,
            width: 15,
        })
        this.#grid.createEmptyGrid()
        this.#arcanoid = new MShape({
            bitmap: Shapes.get('arcanoid') as TGrid,
            x: 0,
            y: this.#grid.maxY - 1,
        })
        this.#arcanoid.setX(
            HMath.round(this.#grid.width / 2) -
                HMath.round(this.#arcanoid.width / 2)
        )
        this.#grid.addShape(this.#arcanoid)
        this.#isGameOver = ref(false)
        this.#speed = ref(400)
        this.#score = ref(0)
        this.#isPaused = false
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

    get isGameOver() {
        return this.#isGameOver
    }

    run() {}

    /**
     * {@inheritDoc IGameWorkflow}
     */
    pause() {}

    /**
     * Передвигает арканоид
     * @param direction
     */
    moveArcanoid(direction: EMoveDirection) {
        if (direction === EMoveDirection.right) {
            this.#arcanoid.moveX(1)
        }

        if (direction === EMoveDirection.left) {
            this.#arcanoid.moveX(-1)
        }
    }

    /**
     * Делает выстрел от арканоида вверх
     */
    shoot() {
        this.#lastShoot = new Shoot({
            direction: EMoveDirection.up,
            fromShape: this.#arcanoid,
            grid: this.#grid,
            position: [this.#arcanoid.x, this.#arcanoid.midY],
        })
        this.#lastShoot = new Shoot({
            direction: EMoveDirection.up,
            fromShape: this.#arcanoid,
            grid: this.#grid,
            position: [this.#arcanoid.maxX, this.#arcanoid.midY],
        })
    }
}
