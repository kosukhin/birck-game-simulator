import ArrayHeler from "~~/src/Helpers/ArrayHeler";
import ObjectsHelper from "~~/src/Helpers/ObjectsHelper";
import { Shape } from "~~/src/Library/Shape";

export class GridService {
    public width = 10;
    private height = 15;
    private girdArray: number[][] = [];
    private activeShape?: Shape;

    constructor() {
        this.clearGrid();
    }

    canGoNextStep(): boolean {
        if (!this.activeShape) {
            return true;
        }

        const shape = this.activeShape;
        const grid = this.girdArray;
        const gridShape = ObjectsHelper.clone(this.activeShape.grid);
        const y = Number(this.activeShape.position.y);
        const x = Number(this.activeShape.position.x);
        const bottomLine = ObjectsHelper.clone(gridShape[gridShape.length - 1]);
        let maxX = x;
        const maxY = grid.length - gridShape.length;
        bottomLine.reverse().forEach((val, index) => {
            const relativeIndex = x + index;

            if (val && maxX < relativeIndex) {
                maxX = relativeIndex;
            }
        });

        if (y === maxY) {
            return false;
        }

        // for (let ix = x; ix <= shape.maxX-1; ix++) {
        //     if (grid[shape.maxY][ix]) {
        //         return false;
        //     }
        // }


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
     * Динамический геттер, который мержит
     * свое состояние состоянием текущей активной фигуры
     * @returns Array
     */
    getGrid() {
        const grid = ObjectsHelper.clone(this.girdArray);
        const app = useNuxtApp();

        if (!this.activeShape) {
            app.$services.game.addRandomShapeToGrid();
        }

        app.$services.logger.log('shape_form', JSON.stringify(this.activeShape.grid));

        if (this.activeShape) {
            const activeShape = this.activeShape;

            // Копируем фигуру на грид
            for(const i in this.activeShape.grid) {
                let x = Number(activeShape.position.x);
                let y = Number(activeShape.position.y);

                app.$services.logger.log(
                    'max',
                    'maxX', activeShape.maxX,
                    'maxY', activeShape.maxY,
                )

                if (activeShape.maxX > this.width) {
                    x = this.width - activeShape.maxX;
                    activeShape.setPosition(x, y);
                }

                if (activeShape.position.x < 0) {
                    x = 0;
                    activeShape.setPosition(x, y);
                }


                for(const j in this.activeShape.grid[i]) {
                    const nextY = y + Number(i);
                    const nextX = x + Number(j);
                    grid[nextY][nextX] = activeShape.grid[i][j] || grid[nextY][nextX];
                }
            }

            app.$services.logger.log('shape', activeShape.position);
        }

        app.$services.logger.log('shape', grid);

        return grid;
    }

    getActiveShape(): Shape {
        return this.activeShape as Shape;
    }

    addActiveShape(shape: Shape) {
        this.activeShape = shape;
    }

    /**
     * Очищаем грид
     */
    clearGrid() {
        this.girdArray = this.createEmptyGrid();
    }

    getHeight() {
        return this.height;
    }

    saveCurrentGrid() {
        this.girdArray = this.getGrid();
    }

    createEmptyRow() {
        const newRow = [];

        for (let i = 0; i < this.width; i++) {
            newRow[i] = 0;
        }

        return newRow;
    }

    createEmptyGrid() {
        const newGrid = [];

        for (let i = 0; i < this.height; i++) {
            newGrid[i] || (newGrid[i] = []);

            for (let j = 0; j < this.width; j++) {
                newGrid[i][j] = 0;
            }
        }

        return newGrid;
    }

    /**
     * Проверка что игра закончилась
     * @returns
     */
    checkGameOver() {
        return this.girdArray[0].indexOf(1) !== -1;
    }

    /**
     * Проверяем заполненность линий
     * @returns
     */
    checkLinesFilled() {
        const lastLine = this.girdArray[this.height-1];
        let filledLineIndex = -1;

        for (const index in this.girdArray) {
            if (ArrayHeler.isAllElementsEqualsTo(this.girdArray[index], 1)) {
                filledLineIndex = Number(index);
                break;
            }
        }

        if (filledLineIndex === -1) {
            return;
        }

        const app = useNuxtApp();
        app.$services.game.score.value += 1;
        app.$services.game.cycleSpeed.value -= app.$services.game.score.value * 5;
        const newLine = this.createEmptyRow();
        this.girdArray.splice(filledLineIndex, 1);
        this.girdArray.unshift(newLine);
        // Рекурсивно проверяем все заполненные линии
        this.checkLinesFilled();
    }
}
