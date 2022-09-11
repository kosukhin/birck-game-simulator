import { HApp } from '~~/src/Common/Helpers/HApp'
import { Observable } from '~~/src/Common/Library/Observable'
import { ShapeMover } from '~~/src/Common/Library/ShapeMover'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { MShape } from '~~/src/Common/Models/MShape'
import { EMoveDirection } from '~~/src/Common/Types/GameTypes'
import { TShapePosition } from '~~/src/Common/Types/GridTypes'

const SHOOT_SPEED = 50

interface IShootParam {
    grid: MGrid
    position: TShapePosition
    direction: EMoveDirection
    fromShape: MShape
}

/**
 * Абстракция выстрела
 */
export class Shoot {
    #grid: MGrid
    #position: TShapePosition
    #direction: EMoveDirection
    #fromShape: MShape
    #shapeMover: ShapeMover = new ShapeMover()
    /** Хук попадания в цель, передает фигуру по которой попали */
    hitTheTarget = new Observable<(target: MShape) => void>()

    constructor(params: IShootParam) {
        this.#grid = params.grid
        this.#position = params.position
        this.#direction = params.direction
        this.#fromShape = params.fromShape
        this.run()
    }

    run() {
        const direction = this.#direction
        const shootId = HApp.uniqueId()
        const shoot = new MShape({
            id: shootId,
            x: this.#position[0],
            y: this.#position[1],
            bitmap: [[1]],
        })
        this.#grid.addShape(shoot)

        const shootRenderHandler = setInterval(() => {
            this.#shapeMover.move(shoot, direction)

            // Промах
            if (this.#grid.isShapeOutOfBounds(shoot)) {
                this.#grid.removeShapeById(shootId)
                clearInterval(shootRenderHandler)
            }

            const intersectedShape =
                this.#grid.isShapeIntersectedWithOtherShape(shoot)

            // Попали в фигуру
            if (
                intersectedShape &&
                intersectedShape !== this.#fromShape &&
                intersectedShape !== shoot
            ) {
                this.#grid.removeShapeById(shootId)
                this.#grid.removeShape(intersectedShape)
                clearInterval(shootRenderHandler)
                this.hitTheTarget.runSubscribers(intersectedShape)
            }
        }, SHOOT_SPEED)
    }
}
