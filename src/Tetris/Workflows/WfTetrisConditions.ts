import { HArray } from '~~/src/Common/Helpers/HArray'
import { HObjects } from '~~/src/Common/Helpers/HObjects'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { IPoint } from '~~/src/Common/Types/GameTypes'

/**
 * Процесс отвечающий за выполнение основных
 * условий игры.
 */
export class WfTetrisConditions {
    /** Основная сетка игры */
    #grid: MGrid

    constructor(grid: MGrid) {
        this.#grid = grid
    }

    /**
     * Проверяет может ли текущий падающий блок
     * Падать дальше
     * @returns
     */
    canShapeMoveNext(): boolean {
        const shape = this.#grid.getFirstShape()

        if (!shape) {
            return true
        }

        const grid = this.#grid.bgBitmap
        const gridShape = shape.bitmap
        const y = Number(shape.y)
        const x = Number(shape.x)
        const bottomLine = HObjects.clone(gridShape[gridShape.length - 1])
        let maxX = x
        const maxY = grid.length - gridShape.length
        bottomLine.reverse().forEach((val: number, index: number) => {
            const relativeIndex = x + index

            if (val && maxX < relativeIndex) {
                maxX = relativeIndex
            }
        })

        // Достигли последней линии сетки
        if (y === maxY) {
            return false
        }

        if (this.checkShapeIntersection({ y: 1 })) {
            return false
        }

        return true
    }

    /**
     * Проверяем что текущая фигура не имеет пересечения с уже существующими элементами сетки
     * @param offset
     */
    checkShapeIntersection({ x: ox = 0, y: oy = 0 }: IPoint): boolean {
        const shape = this.#grid.getFirstShape()

        if (!shape) {
            return false
        }

        const grid = this.#grid.bgBitmap
        const gridShape = shape.bitmap
        const y = Number(shape.y)
        const x = Number(shape.x)

        for (let iy = 0; iy < gridShape.length; iy++) {
            for (let ix = 0; ix < gridShape[iy].length; ix++) {
                const nx = ix + x + ox
                const ny = iy + y + oy
                const valueInGridNext = grid[ny] && grid[ny][nx]
                const valueInShape = gridShape[iy][ix]

                if (valueInGridNext && valueInShape) {
                    return true
                }
            }
        }

        return false
    }

    /**
     * Проверяет что игра закончена
     * @returns
     */
    checkGameOver(): boolean {
        return this.#grid.bgBitmap[0].includes(1)
    }

    /**
     * Проверяет заполненные линии сетки
     * Возвращает массив с индексами которые заполнены
     */
    checkLinesFilled() {
        const grid = this.#grid.bgBitmap
        const filledLineIndexes = []

        for (const index in grid) {
            if (HArray.isAllElementsEqualsTo(grid[index], 1)) {
                filledLineIndexes.push(Number(index))
            }
        }

        return filledLineIndexes
    }
}
