import { Ref } from "nuxt/dist/app/compat/capi";
import { Grid } from "~~/src/Models/Grid";
import { GameConditionsWorkflow } from "~~/src/Workflows/Tetris/GameConditionsWorkflow";
import Shapes from "~~/src/Data/Shapes";
import ObjectsHelper from "~~/src/Helpers/ObjectsHelper";
import { Shape } from "~~/src/Models/Shape";
import LogHelper from "~~/src/Helpers/LogHelper";

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

    /**
     * Счетчик необходимый для формирования ключа обновления сетки
     */
    #updateCounter: Ref<number>;

    constructor() {
        this.#grid = new Grid({});
        this.#grid.setGrid(this.createEmptyGrid());
        this.#conditions = new GameConditionsWorkflow(this.#grid);
        this.#score = ref(0);
        this.#speed = ref(500);
        this.#isGameOver = ref(false);
        this.#updateCounter = ref(0);
    }

    get isGameOver() {
        return this.#isGameOver;
    }

    /**
     * Отдаем сетку на рендеринг из этого процесса
     */
    get grid() {
        return this.#grid;
    }

    get updateCounter() {
        return this.#updateCounter;
    }

    get score() {
        return this.#score;
    }

    get speed() {
        return this.#speed;
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
                this.#isGameOver.value = true;
            }

            this.#updateCounter.value += 1;
        }, this.#speed.value);
    }

    /**
     * Рендерит следующий фрейм игры
     */
    renderNextFrame() {
        LogHelper.log('fulltrace', 'render next frame');
        const grid = this.#grid.render();
        let shape = this.#grid.getFirstShape();

        if (!shape) {
            this.addRandomShapeToGrid();
            shape = this.#grid.getFirstShape();
        }

        LogHelper.log('fulltrace', 'has shape?', shape ? 'yes' : 'no');
        const canMove = this.#conditions.canShapeMoveNext();

        if (!canMove) {
            this.#grid.setGrid(grid);
            this.#grid.clearShapes();
            const filledLineIndexes = this.#conditions.checkLinesFilled();

            LogHelper.log('fulltrace', 'filledLineIndexes', JSON.stringify(filledLineIndexes));

            if (filledLineIndexes.length) {
                for (const index of filledLineIndexes) {
                    this.#grid.removeRowByIndex(Number(index));
                    this.#grid.addRowToTop(this.createEmptyRow());
                    this.#score.value += 1;
                    this.#speed.value -= 10;
                }
            }
        }

        if (shape && canMove) {
            shape.moveY();
        }

        LogHelper.log('fulltrace', grid);
    }

    /**
     * Добавляет на сетку игры новую рандомную
     * фигуру, в центр сетки
     */
    addRandomShapeToGrid() {
        const app = useNuxtApp();
        const index = Math.round(Math.random() * (Shapes.length - 1));
        const bitmap = ObjectsHelper.clone(Shapes[index]);
        const shape = new Shape({bitmap});
        const { round } = Math;
        shape.position = [round(this.#grid.width / 2) - round(shape.width / 2), -1];
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

    updateGrid() {
        this.#updateCounter.value++;
    }
}
