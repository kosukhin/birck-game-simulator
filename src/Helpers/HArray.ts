import { HObjects } from '~~/src/Helpers/HObjects'

/**
 * Хелпер для работы над массивами
 */
export class HArray {
    /**
     * Поворачивает массив на 90 градусов,
     * возвращает новый массив, не мутирует массив из параметров
     * @param a исходный массив
     * @returns
     */
    static rotate90(a: any[]) {
        const w = a.length
        const h = a[0].length
        const b = new Array(h)

        for (let y = 0; y < h; y++) {
            b[y] = new Array(w)

            for (let x = 0; x < w; x++) {
                b[y][x] = a[w - 1 - x][y]
            }
        }

        return b
    }

    /**
     * Проверяет что все элементы массива равны значению
     * из параметра equalsTo
     * @param arr проверяемый массив
     * @param equalsTo значение которому должны быть равны элементы
     * @returns
     */
    static isAllElementsEqualsTo(arr: any[], equalsTo: number): boolean {
        return arr.reduce((acc, item) => {
            return acc && item === equalsTo
        }, true)
    }

    /**
     * Создает двумерный массив заданной ширины и высоты
     * @param width
     * @param height
     * @returns
     */
    static createTwoDemGrid(width: number, height: number) {
        const newGrid = []

        for (let i = 0; i < height; i++) {
            newGrid[i] || (newGrid[i] = [])

            for (let j = 0; j < width; j++) {
                newGrid[i][j] = 0
            }
        }

        return newGrid
    }

    /**
     * Перемешивает массив в рандомном порядке,
     * входной массив не изменяет, возвращает новый
     * @param array
     */
    static shuffleArray(array: any[]) {
        const result = HObjects.clone(array)

        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[result[i], result[j]] = [result[j], result[i]]
        }

        return result
    }
}
