import { HArray } from '~~/src/Common/Helpers/HArray'
import { HObjects } from '~~/src/Common/Helpers/HObjects'
import { MShape } from '~~/src/Common/Models/MShape'
import { TGrid } from '~~/src/Common/Types/GridTypes'

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
    /** Ширина сетки */
    #width: number
    /** Высота сетки */
    #height: number
    /** Бэкграунд сетки */
    #bgBitmap: TGrid
    /** Активные фигуры на сетке */
    #shapes: MShape[]

    constructor(params: IGridParams) {
        const { height = 15, width = 10, bgBitmap = [] } = params
        this.#height = height
        this.#width = width
        this.#bgBitmap = bgBitmap
        this.#shapes = []
    }

    get shapesCount(): number {
        return this.#shapes.length
    }

    get width(): number {
        return this.#width
    }

    get height(): number {
        return this.#height
    }

    get bgBitmap() {
        return this.#bgBitmap
    }

    get maxX() {
        return this.width - 1
    }

    get maxY() {
        return this.height - 1
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
                if (shape.maxX > this.width - 1) {
                    x = this.width - shape.width
                    shape.setPosition([x, y])
                }

                // Пересечение границы слева
                if (shape.x < 0) {
                    x = 0
                    shape.setPosition([x, y])
                }

                if (shape.y <= 0) {
                    shape.setY(0)
                }

                if (shape.maxY >= this.#height - 1) {
                    shape.setY(this.#height - shape.height)
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

        if (index !== -1) {
            this.#shapes.splice(index, 1)
        }
    }

    /**
     * Удаление фигуры из массива
     * @param shape
     */
    removeShape(shape: MShape) {
        const index = this.#shapes.indexOf(shape)

        if (index !== -1) {
            this.#shapes.splice(index, 1)
        }
    }

    /**
     * Проверяет что на сетке есть фигуры
     * @param shape
     * @returns
     */
    hasShape(shape: MShape) {
        return this.#shapes.includes(shape)
    }

    /**
     * Проверяем наличие фигуры по id
     * @param id
     * @returns
     */
    hasShapeById(id) {
        return this.#shapes.findIndex((shape) => shape.id === id) !== -1
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
     * Возвращает все фигуры сетки
     * @returns
     */
    getShapes(): MShape[] {
        return this.#shapes
    }

    /**
     * Создает пустую сетку
     */
    createEmptyGrid() {
        this.#bgBitmap = HArray.createTwoDemGrid(this.#width, this.#height)
    }

    /**
     * Проверяем что фигура вышла за пределы
     * @param shape
     * @returns
     */
    isShapeOutOfBounds(shape: MShape): boolean {
        const lessThanX = shape.x < 0
        const lessThanY = shape.y < 0
        const moreThanX = shape.x > this.width - 1
        const moreThanY = shape.y > this.height - 1

        return lessThanX || lessThanY || moreThanX || moreThanY
    }

    /**
     * Проверяет пересечение переданной фигуры с какой-нибудь одной
     * фигурой уже существующей на сетке, если пересечение найдено, то будет
     * возвращена фигура с которой случилось пересечение, в противном случае undefined
     * @param shape
     */
    isShapeIntersectedWithOtherShape(shape: MShape): MShape | undefined {
        let intersected: MShape | undefined

        for (const currentShape of this.#shapes) {
            const isIntersectedByX =
                currentShape.x <= shape.x && shape.x <= currentShape.maxX
            const isIntersectedByY =
                currentShape.y <= shape.y && shape.y <= currentShape.maxY

            if (isIntersectedByX && isIntersectedByY) {
                intersected = currentShape
                break
            }
        }

        return intersected
    }
}
