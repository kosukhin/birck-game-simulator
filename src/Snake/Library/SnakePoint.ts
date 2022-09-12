/**
 * Одна точка тела змейки
 */
export class SnakePoint {
    /** x позиция точки */
    #x = 0
    /** y позиция точки */
    #y = 0

    constructor(x: number, y: number) {
        this.#x = x
        this.#y = y
    }

    get x() {
        return this.#x
    }

    get y() {
        return this.#y
    }

    /**
     * Устанавливает позицию точки
     * @param x
     * @param y
     */
    setPosition(x: number, y: number) {
        this.#x = x
        this.#y = y
    }
}
