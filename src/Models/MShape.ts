import { TGrid, TShapePosition } from '~~/src/Types/GridTypes'

interface IShapeParams {
    x?: number
    y?: number
    bitmap?: TGrid
}

/**
 * Представление фигуры, позволяет хранить
 * пиксельные формы, которые могут быть частью Grid
 */
export class MShape {
    #id = MShape.getNewShapeId() // Уникальный id фигуры
    #bitmap: TGrid // Изображение фигуры пиксельное
    #x: number // Позиция фигуры по x
    #y: number // Позиция фигуры по y
    static #shapeIdCounter = 0 // Статический счетчик всех id фигур

    constructor(params: IShapeParams) {
        const { x = 0, y = 0, bitmap = [] } = params
        this.#bitmap = bitmap
        this.#x = x
        this.#y = y
    }

    /**
     * Возвращает сетку фигуры
     */
    get bitmap(): TGrid {
        return this.#bitmap
    }

    /**
     * Устанавливает сетку фигуры
     */
    set bitmap(bitmap) {
        this.#bitmap = bitmap
    }

    /**
     * Возвращает массив [x, y]
     */
    get position(): TShapePosition {
        return [this.#x, this.#y]
    }

    /**
     * Возвращает ширину сетки фигуры
     */
    get width(): number {
        return this.#bitmap[0].length
    }

    /**
     * Устанавливает пзицию через массив [x, y]
     */
    set position(position: TShapePosition) {
        ;[this.#x, this.#y] = position
    }

    /**
     * Возвращает позицию x
     */
    get x() {
        return this.#x
    }

    /**
     * Устанавливает позицию x
     */
    set x(x) {
        this.#x = x
    }

    /**
     * Возвращает позицию y
     */
    get y() {
        return this.#y
    }

    /**
     * Устанавливает позицию y
     */
    set y(y) {
        this.#y = y
    }

    /**
     * Возвращает максимальный X сетки
     */
    get maxX(): number {
        const xAdd = Number(this.#bitmap[0].length)

        return this.x + xAdd
    }

    /**
     * Возвращает максимальный Y
     */
    get maxY(): number {
        const yAdd = Number(this.#bitmap.length)

        return this.y + yAdd
    }

    /**
     * Передвигает фигуру на Y переданный через by
     * @param by
     */
    moveY(by: number = 1) {
        this.#y += 1
    }

    /**
     * Генерирует новый уникальный id для фигуры
     * @returns void
     */
    static getNewShapeId() {
        MShape.#shapeIdCounter = MShape.#shapeIdCounter + 1

        return MShape.#shapeIdCounter
    }
}
