import ObjectsHelper from "~~/src/Helpers/ObjectsHelper";
import { Shape } from "~~/src/Library/Shape";

export class GridService {
    private width = 20;
    private height = 30;
    private girdArray: number[][] = [];
    private activeShape?: Shape;

    constructor() {
        this.clearGrid();
    }

    canGoNextStep(): boolean {
        if (!this.activeShape) {
            return true;
        }

        const grid = this.girdArray;
        const gridShape = this.activeShape.grid;
        const y = Number(this.activeShape.position.y);
        const x = Number(this.activeShape.position.x);
        const bottomLine = gridShape[gridShape.length - 1];
        let maxX = x;
        const maxY = grid.length - 1;
        bottomLine.reverse().forEach((val, index) => {
            const relativeIndex = x + index;

            if (val && maxX < relativeIndex) {
                maxX = relativeIndex;
            }
        });

        if (y === maxY) {
            console.log('maxy');

            return false;
        }

        for(const i in grid[y]) {
            const ix = Number(i);
            if (grid[y][i] && ix >= x && ix <= maxX) {
                console.log('reached x', x, maxX);

                return false;
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

        if (this.activeShape) {
            const activeShape = this.activeShape;

            // Копируем фигуру на грид
            for(const i in this.activeShape.grid) {
                let x = Number(activeShape.position.x);
                let y = Number(activeShape.position.y);

                for(const j in this.activeShape.grid[i]) {

                    grid[x + Number(i)][y + Number(j)] = this.activeShape.grid[i][j];
                }
            }
        }

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

    createEmptyGrid() {
        const newGrid = [];

        for (let i = 0; i < this.width; i++) {
            newGrid[i] || (newGrid[i] = []);

            for (let j = 0; j < this.height; j++) {
                newGrid[i][j] = 0;
            }
        }

        return newGrid;
    }
}