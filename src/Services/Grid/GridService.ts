import ObjectsHelper from "~~/src/Helpers/ObjectsHelper";
import { Shape } from "~~/src/Library/Shape";

export class GridService {
    private width = 10;
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
        const gridShape = this.activeShape.grid;
        const y = Number(this.activeShape.position.y);
        const x = Number(this.activeShape.position.x);
        const bottomLine = gridShape[gridShape.length - 1];
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

        for (let ix = x; ix <= shape.maxX; ix++) {
            if (grid[shape.maxY][ix]) {
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
                    grid[nextY][nextX] = activeShape.grid[i][j];
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
}