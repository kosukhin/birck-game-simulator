import { HArray } from '~~/src/Common/Helpers/HArray'
import { HMath } from '~~/src/Common/Helpers/HMath'
import { EMoveDirection } from '~~/src/Common/Types/GameTypes'
import { TGrid, TShapePosition } from '~~/src/Common/Types/GridTypes'

interface IShapeParams {
    x?: number
    y?: number
    bitmap?: TGrid
    id?: any
    direction?: EMoveDirection
}

/**
 * Представление фигуры, позволяет хранить
 * пиксельные формы, которые могут быть частью Grid
 */
export class MShape {
    /** Уникальный id фигуры */
    #id: any = MShape.getNewShapeId()
    /** Изображение фигуры пиксельное */
    #bitmap: TGrid
    /** Позиция фигуры по x */
    #x: number
    /** Позиция фигуры по y */
    #y: number
    /** Статический счетчик всех id фигур */
    static #shapeIdCounter = 0
    /** Направление фигуры, полезно для установки вращения */
    #direction: EMoveDirection = EMoveDirection.up

    constructor(params: IShapeParams) {
        const { x = 0, y = 0, bitmap = [] } = params
        this.#bitmap = bitmap
        this.#x = x
        this.#y = y

        if (params.id) {
            this.#id = params.id
        }

        if (params.direction) {
            this.#direction = params.direction
        }
    }

    get bitmap(): TGrid {
        let bitmap = this.#bitmap

        // Если у фигуры нестандартный поворот, то поворачиваем битмап
        if (this.#direction !== EMoveDirection.up) {
            this.#direction === EMoveDirection.right &&
                (bitmap = HArray.rotate90(this.#bitmap))
            this.#direction === EMoveDirection.down &&
                (bitmap = HArray.rotate180(this.#bitmap))
            this.#direction === EMoveDirection.left &&
                (bitmap = HArray.rotate270(this.#bitmap))
        }

        return bitmap
    }

    get direction() {
        return this.#direction
    }

    get position(): TShapePosition {
        return [this.#x, this.#y]
    }

    get width(): number {
        return this.#bitmap[0].length
    }

    get x() {
        return this.#x
    }

    get y() {
        return this.#y
    }

    get maxX(): number {
        const xAdd = this.width - 1

        return this.x + xAdd
    }

    get maxY(): number {
        const yAdd = this.height - 1

        return this.y + yAdd
    }

    get midX(): number {
        return this.x + HMath.roundMin((this.width - 1) / 2)
    }

    get midY(): number {
        return this.y + HMath.roundMin((this.height - 1) / 2)
    }

    get id() {
        return this.#id
    }

    get height() {
        return this.#bitmap.length
    }

    /**
     * Устанавливает направление поворота фигуры
     * @param direction
     */
    setDirection(direction: EMoveDirection) {
        this.#direction = direction
    }

    /**
     * Устанавливает сетку фигуры
     */
    setBitmap(bitmap) {
        this.#bitmap = bitmap
    }

    /**
     * Устанавливает пзицию через массив [x, y]
     */
    setPosition(position: TShapePosition) {
        ;[this.#x, this.#y] = position
    }

    /**
     * Устанавливает позицию y
     */
    setY(y: number) {
        this.#y = y
    }

    /**
     * Устанавливает x позицию
     */
    setX(x: number) {
        this.#x = x
    }

    /**
     * Передвигает фигуру на Y переданный через by
     * @param by
     */
    moveY(by: number = 1) {
        this.#y += by
    }

    /**
     * Передвигает фигуру на x переданный через by
     * @param by
     */
    moveX(by: number = 1) {
        this.#x += by
    }

    /**
     * Возвращает true если на фигуре нету ни одной точки
     */
    isShapeEmpty() {
        let empty = true

        for (const row of this.#bitmap) {
            if (row.includes(1)) {
                empty = false
                break
            }
        }

        return empty
    }

    /**
     * Удаление пикселя из фигуры
     * @param x
     * @param y
     */
    removePixel(x: number, y: number) {
        let result = false

        if (this.#bitmap[y][x] === 1) {
            this.#bitmap[y][x] = 0
            result = true
        } else if (this.#bitmap?.[y - 1]?.[x] !== undefined) {
            result = this.removePixel(x, y - 1)
        }

        this.clearEmptyRows()

        return result
    }

    /**
     * Очищает пустые строки битмапа фигуры
     */
    clearEmptyRows() {
        this.#bitmap.forEach((row, index) => {
            if (HArray.isAllElementsEqualsTo(row, 0)) {
                this.#bitmap.splice(index, 1)
            }
        })
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
