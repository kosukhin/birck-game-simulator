import { Ref } from 'nuxt/dist/app/compat/capi'
import debounce from 'lodash.debounce'
import uniqueId from 'lodash/uniqueId.js'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { MShape } from '~~/src/Common/Models/MShape'
import { MoveDirection } from '~~/src/Common/Types/GameTypes'
import { HLog } from '~~/src/Common/Helpers/HLog'
import { useService } from '~~/src/Common/Helpers/HService'
import { SConnectors } from '~~/src/Common/Services/SConnectors'

/**
 * Моделька танка
 */
const TANK_SHAPE = [
    [0, 1, 0],
    [1, 1, 1],
    [1, 0, 1],
]
const TANK_SPEED = 200
const SHOOT_SPEED = 50

/**
 * Главная логика игры танки
 */
export class WfTanks {
    grid: MGrid
    updateCounter: Ref<number>
    tank: MShape
    bots: MShape[] = []

    moveDebounceHandler: any = null

    constructor() {
        this.grid = new MGrid({
            height: 30,
            width: 30,
        })
        this.grid.createEmptyGrid()
        this.updateCounter = ref(0)
        this.tank = new MShape({ id: 'tank', bitmap: TANK_SHAPE })

        // @FIXME заюзать здесь генератор
        for (let i = 0; i < 4; i++) {
            this.bots.push(new MShape({ bitmap: TANK_SHAPE }))
        }

        this.grid.addShape(this.tank)
        this.bots.forEach((bot) => this.grid.addShape(bot))
    }

    /**
     * Обеспечивает передвижение танка
     * @param direction
     */
    moveTank(direction: MoveDirection) {
        this.moveDebounceHandler && this.moveDebounceHandler.cancel()
        this.moveDebounceHandler = debounce(async () => {
            HLog.log('tanks', direction)
            this.tank.setRotation(direction)

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

            await useService<SConnectors>(
                'connectors'
            ).browser.requestAnimationFrame()
            this.updateCounter.value++
        }, TANK_SPEED)
        this.moveDebounceHandler()
    }

    /**
     * Стреляет танк
     */
    shoot() {
        const direction = this.tank.getRotation()
        const shootId = uniqueId()
        const shoot = new MShape({
            id: shootId,
            x: this.tank.x,
            y: this.tank.y,
            bitmap: [[1]],
        })
        this.grid.addShape(shoot)

        const shootRenderHandler = setInterval(async () => {
            switch (direction) {
                case MoveDirection.up:
                    shoot.moveY(-1)
                    break
                case MoveDirection.down:
                    shoot.moveY(1)
                    break
                case MoveDirection.right:
                    shoot.moveX(1)
                    break
                case MoveDirection.left:
                    shoot.moveX(-1)
                    break
            }

            if (this.grid.isShapeOutOfBounds(shoot)) {
                this.grid.removeShapeById(shootId)
                clearInterval(shootRenderHandler)
            }

            await useService<SConnectors>(
                'connectors'
            ).browser.requestAnimationFrame()
            this.updateCounter.value++
        }, SHOOT_SPEED)
    }
}
