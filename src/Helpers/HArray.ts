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
}
