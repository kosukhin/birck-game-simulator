import { Ref } from 'nuxt/dist/app/compat/capi'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { MShape } from '~~/src/Common/Models/MShape'
import { MoveDirection } from '~~/src/Common/Types/GameTypes'
import { HLog } from '~~/src/Common/Helpers/HLog'

/**
 * Моделька танка
 */
const TANK_SHAPE = [
    [0, 1, 0],
    [1, 1, 1],
    [1, 0, 1],
]

/**
 * Главная логика игры танки
 */
export class WfTanks {
    grid: MGrid
    updateCounter: Ref<number>
    tank: MShape
    bots: MShape[] = []

    constructor() {
        this.grid = new MGrid({
            height: 20,
            width: 20,
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

    moveTank(direction: MoveDirection) {
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

        this.updateCounter.value++
    }
}
