import { Ref } from 'nuxt/dist/app/compat/capi'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { MShape } from '~~/src/Common/Models/MShape'
import { MoveDirection } from '~~/src/Common/Types/GameTypes'
import { HLog } from '~~/src/Common/Helpers/HLog'
import { useService } from '~~/src/Common/Helpers/HService'
import { SConnectors } from '~~/src/Common/Services/SConnectors'
import { Bot } from '~~/src/Tanks/Library/Bot'
import { Shoot } from '~~/src/Tanks/Library/Shoot'
import { HMath } from '~~/src/Common/Helpers/HMath'

/**
 * Моделька танка
 */
const TANK_SHAPE = [
    [0, 1, 0],
    [1, 1, 1],
    [1, 0, 1],
]
const SHOOT_SPEED = 50

/**
 * Главная логика игры танки
 */
export class WfTanks {
    grid: MGrid
    updateCounter: Ref<number>
    tank: MShape
    bots: MShape[] = []
    isGameOver: Ref<boolean>
    score: Ref<number>
    lastShoot: Shoot
    lastBot: Bot

    frameRenderTimePointer: any = null
    moveDebounceHandler: any = null

    constructor() {
        this.grid = new MGrid({
            height: 20,
            width: 20,
        })
        this.score = ref(0)
        this.grid.createEmptyGrid()
        this.updateCounter = ref(0)
        this.isGameOver = ref(false)
        this.tank = new MShape({
            id: 'tank',
            bitmap: TANK_SHAPE,
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

    run() {
        this.frameRenderTimePointer = setInterval(async () => {
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
                        position: [HMath.round(this.grid.maxX / 2), maxHeight],
                        direction: MoveDirection.up,
                    })
                }
            }

            this.checkGameOver()
            await useService<SConnectors>(
                'connectors'
            ).browser.requestAnimationFrame()
            this.updateCounter.value++
        }, SHOOT_SPEED)
    }

    stop() {
        clearInterval(this.frameRenderTimePointer)
    }

    /**
     * Обеспечивает передвижение танка
     * @param direction
     */
    async moveTank(direction: MoveDirection) {
        HLog.log('tanks', direction)

        if (this.tank.getRotation() === direction) {
            switch (direction) {
                case MoveDirection.up:
                    this.tank.moveY(-1)
                    break
                case MoveDirection.down:
                    this.tank.moveY(1)
                    break
                case MoveDirection.right:
                    this.tank.moveX(1)
                    break
                case MoveDirection.left:
                    this.tank.moveX(-1)
                    break
            }
        }

        this.tank.setRotation(direction)
        await useService<SConnectors>(
            'connectors'
        ).browser.requestAnimationFrame()
        this.updateCounter.value++
    }

    /**
     * Проверяет что игра закончена
     */
    checkGameOver() {
        let isTankAlive = false

        this.grid.getShapes().forEach((shape) => {
            if (shape === this.tank) {
                isTankAlive = true
            }
        })

        this.isGameOver.value = !isTankAlive

        if (this.isGameOver.value) {
            this.stop()
        }
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
