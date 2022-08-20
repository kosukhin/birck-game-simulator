import ArrayHeler from "~~/src/Helpers/ArrayHeler";
import ObjectsHelper from "~~/src/Helpers/ObjectsHelper";
import { Grid } from "~~/src/Models/Grid";

/**
 * Процесс отвечающий за выполнение основных
 * условий игры.
 */
export class GameConditionsWorkflow {
    #grid: Grid;

    constructor(grid: Grid) {
        this.#grid = grid;
    }

    /**
     * Проверяет может ли текущий падающий блок
     * Падать дальше
     * @returns
     */
    canShapeMoveNext(): boolean {
        const shape = this.#grid.getFirstShape();

        if (!shape) {
            return true;
        }

        const grid = this.#grid.bgBitmap;
        const gridShape = shape.bitmap;
        const y = Number(shape.y);
        const x = Number(shape.x);
        const bottomLine = ObjectsHelper.clone(gridShape[gridShape.length - 1]);
        let maxX = x;
        const maxY = grid.length - gridShape.length;
        bottomLine.reverse().forEach((val: number, index: number) => {
            const relativeIndex = x + index;

            if (val && maxX < relativeIndex) {
                maxX = relativeIndex;
            }
        });

        // Достигли последней линии сетки
        if (y === maxY) {
            return false;
        }

        // Проверяем что текущая фигура не имеет пересечения с уже имеющимися элементами сетки
        for (let iy = 0; iy < gridShape.length; iy++) {
            for (let ix = 0; ix < gridShape[iy].length; ix++) {
                const nx = ix + x;
                const ny = iy + y + 1;
                const valueInGridNext = grid[ny] && grid[ny][nx];
                const valueInShape = gridShape[iy][ix];

                if (valueInGridNext && valueInShape) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Проверяет что игра закончена
     * @returns
     */
    checkGameOver(): boolean {
        return this.#grid.grid[0].indexOf(1) !== -1;
    }

    /**
     * Проверяет заполненные линии сетки
     * Возвращает массив с индексами которые заполнены
     */
    checkLinesFilled() {
        const grid = this.#grid.bgBitmap;
        const filledLineIndexes = [];

        for (const index in grid) {
            if (ArrayHeler.isAllElementsEqualsTo(grid[index], 1)) {
                filledLineIndexes.push(Number(index));
            }
        }

        return filledLineIndexes;
    }
}
