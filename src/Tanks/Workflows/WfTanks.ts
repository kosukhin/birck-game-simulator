import { Ref } from 'nuxt/dist/app/compat/capi'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { MShape } from '~~/src/Common/Models/MShape'
import { EMoveDirection } from '~~/src/Common/Types/GameTypes'
import { useService } from '~~/src/Common/Helpers/HService'
import { SConnectors } from '~~/src/Common/Services/SConnectors'
import { Bot } from '~~/src/Tanks/Library/Bot'
import { Shoot } from '~~/src/Tanks/Library/Shoot'
import { HMath } from '~~/src/Common/Helpers/HMath'
import { Shapes } from '~~/src/Tanks/Data/Shapes'
import { ShapeMover } from '~~/src/Common/Library/ShapeMover'
import { HApp } from '~~/src/Common/Helpers/HApp'

const SHOOT_SPEED = 50

/**
 * Главная логика игры танки
 */
export class WfTanks {
    /** Основная сетка игры */
    #grid: MGrid
    /** Танк игрока */
    #tank: MShape
    /** Флаг игра закончена */
    #isGameOver: Ref<boolean>
    /** Счет игры */
    #score: Ref<number>
    /** Ссылка на бота */
    #lastBot: Bot
    /** Логика перемещения танка */
    #shapeMover: ShapeMover = new ShapeMover()

    constructor() {
        this.#grid = new MGrid({
            height: 20,
            width: 20,
        })
        this.#score = ref(0)
        this.#grid.createEmptyGrid()
        this.#isGameOver = ref(false)
        this.#tank = new MShape({
            id: 'tank',
            bitmap: Shapes.player,
            direction: EMoveDirection.down,
        })
        this.#lastBot = new Bot({
            grid: this.#grid,
            enemy: this.#tank,
            position: [this.#grid.maxX, this.calculateMaxHeight()],
            direction: EMoveDirection.up,
        })
        this.#grid.addShape(this.#tank)
    }

    get grid() {
        return this.#grid
    }

    get isGameOver() {
        return this.#isGameOver
    }

    get score() {
        return this.#score
    }

    /**
     * Запускает игру танки
     */
    async run() {
        await HApp.wait(SHOOT_SPEED)
        useService<SConnectors>('connectors').browser.requestAnimationFrame(
            () => {
                // Если нету врагов, добавляем еще бота
                if (this.#grid.shapesCount <= 1) {
                    this.#lastBot = new Bot({
                        grid: this.#grid,
                        enemy: this.#tank,
                        position: [this.#grid.maxX, this.calculateMaxHeight()],
                        direction: EMoveDirection.up,
                    })

                    if (this.#score.value >= 10) {
                        this.#lastBot = new Bot({
                            grid: this.#grid,
                            enemy: this.#tank,
                            position: [
                                HMath.round(this.#grid.maxX / 2),
                                this.calculateMaxHeight(),
                            ],
                            direction: EMoveDirection.up,
                        })
                    }

                    if (this.#score.value >= 20) {
                        this.#lastBot = new Bot({
                            grid: this.#grid,
                            enemy: this.#tank,
                            position: [0, this.calculateMaxHeight()],
                            direction: EMoveDirection.up,
                        })
                    }
                }

                this.checkGameOver()
                !this.#isGameOver.value && this.run()
            }
        )
    }

    /**
     * Обеспечивает передвижение танка
     * @param direction
     */
    moveTank(direction: EMoveDirection) {
        if (this.#tank.direction === direction) {
            this.#shapeMover.move(this.#tank, direction)
        }

        this.#tank.setDirection(direction)
    }

    /**
     * Проверяет что игра закончена
     * Игра будет закончена если танк игрока уничтожен
     */
    checkGameOver() {
        const isTankAlive = this.#grid.hasShape(this.#tank)
        this.#isGameOver.value = !isTankAlive
    }

    /**
     * Стреляет танк
     */
    shoot() {
        const shoot = new Shoot({
            direction: this.#tank.direction,
            fromShape: this.#tank,
            grid: this.#grid,
            position: [this.#tank.midX, this.#tank.midY],
        })

        // Подписываемся на попадание
        shoot.hitTheTarget.registerSubscriber((target) => {
            if (target !== this.#tank) {
                this.increaseScore()
            }
        })
    }

    /**
     * Увеличивает счет игры на 1
     */
    increaseScore() {
        this.#score.value++
    }

    /**
     * Рассчитывает максимальную высоту для установки танка
     * @returns
     */
    calculateMaxHeight() {
        return this.#grid.maxY - this.#tank.height + 1
    }
}
