
export default new class ArrayHelper {
    /**
     * Поворачивает массив на 90 градусов
     * @param a
     * @returns
     */
    rotate90(a) {
        const w = a.length;
        const h = a[0].length;
        let b = new Array(h);

        for (let y = 0; y < h; y++) {
            b[y] = new Array(w);

            for (let x = 0; x < w; x++) {
                b[y][x] = a[w - 1 - x][y];
            }
        }

        return b;
    }

    /**
     * Проверяет что все элементы массива равны значению
     * @param arr
     * @param equalsTo
     * @returns
     */
    isAllElementsEqualsTo(arr, equalsTo): boolean {
        return arr.reduce((acc, item) => {
            return acc && item === equalsTo;
        }, true);
    }
}
