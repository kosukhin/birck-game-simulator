import { Shape } from "~~/src/Library/Shape";

export class GridService {
    private width = 20;
    private height = 30;
    private girdArray: number[][] = [];
    private activeShape?: Shape;

    constructor() {
        this.clearGrid();
    }

    /**
     * Динамический геттер, который мержит
     * свое состояние состоянием текущей активной фигуры
     * @returns Array
     */
    getGrid() {
        const grid = JSON.parse(JSON.stringify(this.girdArray));
        const app = useNuxtApp();

        if (!this.activeShape) {
            app.$services.game.addRandomShapeToGrid();
        }

        if (this.activeShape) {
            const subGrid = this.createEmptyGrid();
            const activeShape = this.activeShape;

            // Копируем фигуру на грид
            for(const i in this.activeShape.grid) {
                let x = Number(activeShape.position.x);
                let y = Number(activeShape.position.y);

                for(const j in this.activeShape.grid[i]) {

                    subGrid[x + Number(i)][y + Number(j)] = this.activeShape.grid[i][j];
                }
            }


            for (const i in grid) {
                for (const j in grid[i]) {
                    grid[i][j] = grid[i][j] || subGrid[i][j];
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
        this.activeShape = undefined;
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