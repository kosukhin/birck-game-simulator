import { HArray } from '~~/src/Helpers/HArray'
import { HLog } from '~~/src/Helpers/HLog'
import { HObjects } from '~~/src/Helpers/HObjects'
import { MShape } from '~~/src/Models/MShape'
import { TGrid } from '~~/src/Types/GridTypes'

interface IGridParams {
    height?: number
    width?: number
    bgBitmap?: TGrid
}

/**
 * Представление сетки, позволяет выводить
 * на экран результаты игры, позволяет выполнять
 * манипуляции над пикселями
 */
export class MGrid {
    #width: number // Ширина сетки
    #height: number // Высота сетки
    #bgBitmap: TGrid // Бэкграунд сетки
    #shapes: MShape[] // Активные фигуры на сетке

    constructor(params: IGridParams) {
        const { height = 15, width = 10, bgBitmap = [] } = params
        this.#height = height
        this.#width = width
        this.#bgBitmap = bgBitmap
        this.#shapes = []
    }

    /**
     * Возвращает ширину сетки
     */
    get width(): number {
        return this.#width
    }

    /**
     * Возвращает высоту сетки
     */
    get height(): number {
        return this.#height
    }

    /**
     * Вовращает фон сетки, без активных фигур
     */
    get bgBitmap() {
        return this.#bgBitmap
    }

    /**
     * Рендерит сетку
     */
    render() {
        const grid = HObjects.clone(this.#bgBitmap)
        const copyShapeToGrid = (shape) => {
            // Копируем фигуру на грид
            for (const i in shape.bitmap) {
                let x = Number(shape.x)
                const y = Number(shape.y)

                // Пересечение границы справа
                if (shape.maxX > this.width) {
                    x = this.width - shape.width
                    shape.position = [x, y]
                }

                // Пересечение границы слева
                if (shape.x < 0) {
                    x = 0
                    shape.position = [x, y]
                }

                if (shape.y <= 0) {
                    shape.y = 0
                }

                if (shape.maxY > this.#height) {
                    shape.y = this.#height - 1
                }

                // Переносим пиксели фигуры на сетку
                for (const j in shape.bitmap[i]) {
                    const nextY = y + Number(i)
                    const nextX = x + Number(j)

                    if (!grid[nextY]) {
                        continue
                    }

                    grid[nextY][nextX] =
                        shape.bitmap[i][j] || grid[nextY][nextX]
                }
            }
        }

        for (const shape of this.#shapes) {
            copyShapeToGrid(shape)
        }

        return grid
    }

    /**
     * Устанавливает фон сетки
     * @param bitmap
     */
    setGrid(bitmap: TGrid) {
        this.#bgBitmap = bitmap
    }

    /**
     * Добавляет наверх сетки новую строку
     * @param row
     */
    addRowToTop(row: number[]) {
        this.#bgBitmap.unshift(row)
    }

    /**
     * Удаляет строку по индексу
     * @param index
     */
    removeRowByIndex(index: number) {
        this.#bgBitmap.splice(index, 1)
    }

    /**
     * Добавляет фигуру на сетку
     * @param shape
     */
    addShape(shape: MShape) {
        this.#shapes = [...this.#shapes, shape]
    }

    /**
     * Удаляет фигуру по id
     * @param id
     */
    removeShapeById(id) {
        const index = this.#shapes.findIndex((shape) => shape.id === id)
        HLog.log('snake', id, index, this.#shapes)

        if (index !== -1) {
            this.#shapes.splice(index, 1)
        }
    }

    /**
     * Очищает все фигуры с сетки
     */
    clearShapes() {
        this.#shapes = []
    }

    /**
     * Берет первую фигуру из всех на сетке
     * @returns
     */
    getFirstShape(): MShape | undefined {
        return this.#shapes[0]
    }

    /**
     * Создает пустую сетку
     */
    createEmptyGrid() {
        this.#bgBitmap = HArray.createTwoDemGrid(this.#width, this.#height)
    }
}
