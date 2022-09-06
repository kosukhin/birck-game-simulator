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
}
