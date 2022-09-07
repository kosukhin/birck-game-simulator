/**
 * Хелпер для математических вычислений
 */
export class HMath {
    /**
     * Возвращает рандомное число от min до max
     * @param min
     * @param max
     * @returns
     */
    static random(min: number, max: number) {
        const value = Math.round(Math.random() * max)

        return value < min ? min : value
    }

    /**
     * Округление до ближайшего целого
     * @param num
     * @returns
     */
    static round(num: number): number {
        return Math.round(num)
    }

    static roundMin(num: number): number {
        return Math.floor(num)
    }
}
