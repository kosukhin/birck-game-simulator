import { TGrid, TShapePosition } from "~~/src/Types/GridTypes";

/**
 * Представление фигуры, позволяет хранить
 * пиксельные формы, которые могут быть частью Grid
 */
export class Shape {
    #id = Shape.getNewShapeId();
    #bitmap: TGrid;
    #x: number;
    #y: number;
    static #shapeIdCounter = 0;

    constructor(params) {
        const {
            x=0,
            y=0,
            bitmap=[]
        } = params;
        this.#bitmap = bitmap;
        this.#x = x;
        this.#y = y;
    }

    get bitmap(): TGrid {
        return this.#bitmap;
    }

    set bitmap(bitmap) {
        this.#bitmap = bitmap;
    }

    get position(): TShapePosition {
        return [this.#x, this.#y];
    }

    get width(): number {
        return this.#bitmap[0].length;
    }

    set position(position: TShapePosition) {
        [this.#x, this.#y] = position;
    }

    get x() {
        return this.#x;
    }

    set x(x) {
        this.#x = x;
    }

    get y() {
        return this.#y;
    }

    set y(y) {
        this.#y = y;
    }

    get maxX(): number {
        const xAdd = Number(this.#bitmap[0].length);

        return this.x + xAdd;
    }

    get maxY(): number {
        const yAdd = Number(this.#bitmap.length);

        return this.y + yAdd;
    }

    moveY(by:number = 1) {
        this.#y += 1;
    }

    /**
     * Генерирует новый уникальный id для фигуры
     * @returns void
     */
    static getNewShapeId() {
        Shape.#shapeIdCounter = Shape.#shapeIdCounter + 1;

        return Shape.#shapeIdCounter;
    }
}
