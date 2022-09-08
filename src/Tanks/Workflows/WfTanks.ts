import { Ref } from 'nuxt/dist/app/compat/capi'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { MShape } from '~~/src/Common/Models/MShape'
import { MoveDirection } from '~~/src/Common/Types/GameTypes'
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
    grid: MGrid
    tank: MShape
    bots: MShape[] = []
    isGameOver: Ref<boolean>
    score: Ref<number>
    lastShoot: Shoot
    lastBot: Bot
    #shapeMover: ShapeMover = new ShapeMover()

    frameRenderTimePointer: any = null

    constructor() {
        this.grid = new MGrid({
            height: 20,
            width: 20,
        })
        this.score = ref(0)
        this.grid.createEmptyGrid()
        this.isGameOver = ref(false)
        this.tank = new MShape({
            id: 'tank',
            bitmap: Shapes.player,
            direction: MoveDirection.down,
        })

        const maxHeight = this.grid.maxY - this.tank.height + 1
        this.lastBot = new Bot({
            game: this,
            grid: this.grid,
            enemy: this.tank,
            position: [this.grid.maxX, maxHeight],
            direction: MoveDirection.up,
        })

        this.grid.addShape(this.tank)
    }

    /**
     * Запускает игру танки
     */
    async run() {
        await HApp.wait(SHOOT_SPEED)
        useService<SConnectors>('connectors').browser.requestAnimationFrame(
            () => {
                // Если нету врагов, добавляем еще бота
                if (this.grid.shapesCount <= 1) {
                    const maxHeight = this.grid.maxY - this.tank.height + 1
                    this.lastBot = new Bot({
                        game: this,
                        grid: this.grid,
                        enemy: this.tank,
                        position: [this.grid.maxX, maxHeight],
                        direction: MoveDirection.up,
                    })

                    if (this.score.value >= 10) {
                        this.lastBot = new Bot({
                            game: this,
                            grid: this.grid,
                            enemy: this.tank,
                            position: [
                                HMath.round(this.grid.maxX / 2),
                                maxHeight,
                            ],
                            direction: MoveDirection.up,
                        })
                    }
                }

                this.checkGameOver()
                !this.isGameOver.value && this.run()
            }
        )
    }

    /**
     * Останавливает игру, удаляя основной цикл
     */
    stop() {
        clearInterval(this.frameRenderTimePointer)
    }

    /**
     * Обеспечивает передвижение танка
     * @param direction
     */
    moveTank(direction: MoveDirection) {
        if (this.tank.getRotation() === direction) {
            this.#shapeMover.move(this.tank, direction)
        }

        this.tank.setRotation(direction)
    }

    /**
     * Проверяет что игра закончена
     * Игра будет закончена если танк игрока уничтожен
     */
    checkGameOver() {
        const isTankAlive = this.grid.hasShape(this.tank)
        this.isGameOver.value = !isTankAlive
    }

    /**
     * Стреляет танк
     */
    shoot() {
        this.lastShoot = new Shoot({
            game: this,
            direction: this.tank.getRotation(),
            fromShape: this.tank,
            grid: this.grid,
            position: [this.tank.midX, this.tank.midY],
        })
    }
}
