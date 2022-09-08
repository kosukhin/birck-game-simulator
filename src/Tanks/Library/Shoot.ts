import { HApp } from '~~/src/Common/Helpers/HApp'
import { HLog } from '~~/src/Common/Helpers/HLog'
import { ShapeMover } from '~~/src/Common/Library/ShapeMover'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { MShape } from '~~/src/Common/Models/MShape'
import { MoveDirection } from '~~/src/Common/Types/GameTypes'
import { TShapePosition } from '~~/src/Common/Types/GridTypes'
import { WfTanks } from '~~/src/Tanks/Workflows/WfTanks'

const SHOOT_SPEED = 50

interface IShootParam {
    game: WfTanks
    grid: MGrid
    position: TShapePosition
    direction: MoveDirection
    fromShape: MShape
}

/**
 * Абстракция выстрела
 */
export class Shoot {
    game: WfTanks
    grid: MGrid
    position: TShapePosition
    direction: MoveDirection
    fromShape: MShape
    #shapeMover: ShapeMover = new ShapeMover()

    constructor(params: IShootParam) {
        this.game = params.game
        this.grid = params.grid
        this.position = params.position
        this.direction = params.direction
        this.fromShape = params.fromShape
        this.run()
    }

    run() {
        const direction = this.direction
        const shootId = HApp.uniqueId()
        const shoot = new MShape({
            id: shootId,
            x: this.position[0],
            y: this.position[1],
            bitmap: [[1]],
        })
        this.grid.addShape(shoot)
        HLog.log('tanks', shoot.position)

        const shootRenderHandler = setInterval(() => {
            this.#shapeMover.move(shoot, direction)

            // Промах
            if (this.grid.isShapeOutOfBounds(shoot)) {
                this.grid.removeShapeById(shootId)
                clearInterval(shootRenderHandler)
            }

            const intersectedShape =
                this.grid.isShapeIntersectedWithOtherShape(shoot)

            // Попали в фигуру
            if (
                intersectedShape &&
                intersectedShape !== this.fromShape &&
                intersectedShape !== shoot
            ) {
                HLog.log('tanks', 'intesected with', intersectedShape)
                this.grid.removeShapeById(shootId)
                this.grid.removeShape(intersectedShape)
                clearInterval(shootRenderHandler)
                this.game.score.value++
            }
        }, SHOOT_SPEED)
    }
}
