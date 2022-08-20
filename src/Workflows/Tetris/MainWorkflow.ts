import { Ref } from "nuxt/dist/app/compat/capi";
import { Grid } from "~~/src/Models/Grid";
import { GameConditionsWorkflow } from "~~/src/Workflows/Tetris/GameConditionsWorkflow";
import Shapes from "~~/src/Data/Shapes";
import ObjectsHelper from "~~/src/Helpers/ObjectsHelper";
import { Shape } from "~~/src/Models/Shape";

/**
 * Основной класс хода выполнения игры тетрис
 */
export class MainWorkflow {
    /**
     * Основная сетка тетриса
     */
    #grid: Grid;

    /**
     * Счет игры
     */
    #score: Ref<number>;

    /**
     * Скорость падения блоков
     */
    #speed: Ref<number>;

    /**
     * Флаг игра закончена
     */
    #isGameOver: Ref<boolean>;

    /**
     * Условия игры
     */
    #conditions: GameConditionsWorkflow;

    constructor() {
        this.#grid = new Grid({
            bgBitmap: this.createEmptyGrid(),
        });
        this.#conditions = new GameConditionsWorkflow(this.#grid);
        this.#score = ref(0);
        this.#speed = ref(500);
        this.#isGameOver = ref(false);
    }

    /**
     * Отдаем сетку на рендеринг из этого процесса
     */
    get grid() {
        return this.#grid;
    }

    /**
     * Запускает работы тетриса
     */
    run() {
        setTimeout(() => {
            this.renderNextFrame();

            if (!this.#conditions.checkGameOver()) {
                this.run();
            } else {
                this.#isGameOver.value = false;
            }
        }, this.#speed.value);
    }

    /**
     * Рендерит следующий фрейм игры
     */
    renderNextFrame() {
        let shape = this.#grid.getFirstShape();

        if (!shape) {
            this.addRandomShapeToGrid();
            shape = this.#grid.getFirstShape();
        }

        const canMove = this.#conditions.canShapeMoveNext();

        if (!canMove) {
            this.#grid.setGrid(this.#grid.grid.value);
            this.#conditions.checkLinesFilled();
            const filledLineIndexes = this.#conditions.checkLinesFilled();

            if (filledLineIndexes.length) {
                for (const index in filledLineIndexes) {
                    this.#grid.removeRowByIndex(Number(index));
                    this.#grid.addRowToTop(this.createEmptyRow());
                }
            }
        }

        if (shape && canMove) {
            shape.moveY();
        }
    }

    /**
     * Добавляет на сетку игры новую рандомную
     * фигуру, в центр сетки
     */
    addRandomShapeToGrid() {
        const app = useNuxtApp();
        const index = Math.round(Math.random() * (Shapes.length - 1));
        const bitmap = ObjectsHelper.clone(Shapes[index]);
        const shape = new Shape(bitmap);
        const { round } = Math;
        shape.position = [round(this.#grid.width / 2) - round(shape.width / 2), 0];
        this.#grid.clearShapes();
        this.#grid.addShape(shape);
    }

    /**
     * Создает пустую строку для сетки
     */
    createEmptyRow() {
        const newRow = [];

        for (let i = 0; i < this.#grid.width; i++) {
            newRow[i] = 0;
        }

        return newRow;
    }

    /**
     * Создает пустую сетку
     */
    createEmptyGrid() {
        const newGrid = [];

        for (let i = 0; i < this.#grid.height; i++) {
            newGrid[i] || (newGrid[i] = []);

            for (let j = 0; j < this.#grid.width; j++) {
                newGrid[i][j] = 0;
            }
        }

        return newGrid;
    }
}
