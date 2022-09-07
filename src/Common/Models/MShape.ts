import { HArray } from '~~/src/Common/Helpers/HArray'
import { HMath } from '~~/src/Common/Helpers/HMath'
import { MoveDirection } from '~~/src/Common/Types/GameTypes'
import { TGrid, TShapePosition } from '~~/src/Common/Types/GridTypes'

interface IShapeParams {
    x?: number
    y?: number
    bitmap?: TGrid
    id?: any
    direction?: MoveDirection
}

/**
 * Представление фигуры, позволяет хранить
 * пиксельные формы, которые могут быть частью Grid
 */
export class MShape {
    #id: any = MShape.getNewShapeId() // Уникальный id фигуры
    #bitmap: TGrid // Изображение фигуры пиксельное
    #x: number // Позиция фигуры по x
    #y: number // Позиция фигуры по y
    static #shapeIdCounter = 0 // Статический счетчик всех id фигур
    #rotate: MoveDirection = MoveDirection.up

    constructor(params: IShapeParams) {
        const { x = 0, y = 0, bitmap = [] } = params
        this.#bitmap = bitmap
        this.#x = x
        this.#y = y

        if (params.id) {
            this.#id = params.id
        }

        if (params.direction) {
            this.#rotate = params.direction
        }
    }

    /**
     * Возвращает сетку фигуры
     */
    get bitmap(): TGrid {
        let bitmap = this.#bitmap

        // Если у фигуры нестандартный поворот, то поворачиваем битмап
        if (this.#rotate !== MoveDirection.up) {
            this.#rotate === MoveDirection.right &&
                (bitmap = HArray.rotate90(this.#bitmap))
            this.#rotate === MoveDirection.down &&
                (bitmap = HArray.rotate180(this.#bitmap))
            this.#rotate === MoveDirection.left &&
                (bitmap = HArray.rotate270(this.#bitmap))
        }

        return bitmap
    }

    setRotation(direction: MoveDirection) {
        this.#rotate = direction
    }

    getRotation() {
        return this.#rotate
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
        const xAdd = this.width - 1

        return this.x + xAdd
    }

    /**
     * Возвращает максимальный Y
     */
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
     * Генерирует новый уникальный id для фигуры
     * @returns void
     */
    static getNewShapeId() {
        MShape.#shapeIdCounter = MShape.#shapeIdCounter + 1

        return MShape.#shapeIdCounter
    }
}
