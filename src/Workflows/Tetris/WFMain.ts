import { Ref } from "nuxt/dist/app/compat/capi";
import { Grid } from "~~/src/Models/Grid";
import { WFGameConditions } from "~~/src/Workflows/Tetris/WFGameConditions";
import Shapes from "~~/src/Data/Shapes";
import { Shape } from "~~/src/Models/Shape";
import { ref } from "vue";
import HApp from "~~/src/Helpers/HApp";
import HLog from "~~/src/Helpers/HLog";
import HObjects from "~~/src/Helpers/HObjects";

/**
 * Основной класс хода выполнения игры тетрис
 */
export class WFMain {
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
    #conditions: WFGameConditions;

    /**
     * Счетчик необходимый для формирования ключа обновления сетки
     */
    #updateCounter: Ref<number>;

    constructor() {
        this.#grid = new Grid({});
        this.#grid.setGrid(this.createEmptyGrid());
        this.#conditions = new WFGameConditions(this.#grid);
        this.#score = ref(0);
        this.#speed = ref(500);
        this.#isGameOver = ref(false);
        this.#updateCounter = ref(0);
    }

    /**
     * Отдает флаг закончена ли игра
     */
    get isGameOver() {
        return this.#isGameOver;
    }

    /**
     * Отдаем сетку на рендеринг из этого процесса
     */
    get grid(): Grid {
        return this.#grid;
    }

    /**
     * Отдает счетчик обновления интерфейса
     */
    get updateCounter() {
        return this.#updateCounter;
    }

    /**
     * Отдает счет игры
     */
    get score() {
        return this.#score;
    }

    /**
     * Отдает скорость игры
     */
    get speed() {
        return this.#speed;
    }

    /**
     * Запускает работу тетриса
     */
    async run() {
        await HApp.wait(this.#speed.value);
        this.renderNextFrame();

        if (!this.#conditions.checkGameOver()) {
            this.run();
        } else {
            this.#isGameOver.value = true;
        }

        this.#updateCounter.value += 1;
    }

    /**
     * Рендерит следующий фрейм игры
     */
    renderNextFrame() {
        HLog.log('fulltrace', 'render next frame');
        const grid = this.#grid.render();
        let shape = this.#grid.getFirstShape();

        if (!shape) {
            this.addRandomShapeToGrid();
            shape = this.#grid.getFirstShape();
        }

        HLog.log('fulltrace', 'has shape?', shape ? 'yes' : 'no');
        const canMove = this.#conditions.canShapeMoveNext();

        if (!canMove) {
            this.#grid.setGrid(grid);
            this.#grid.clearShapes();
            const filledLineIndexes = this.#conditions.checkLinesFilled();

            HLog.log('fulltrace', 'filledLineIndexes', JSON.stringify(filledLineIndexes));

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

        HLog.log('fulltrace', grid);
    }

    /**
     * Добавляет на сетку игры новую рандомную
     * фигуру, в центр сетки
     */
    addRandomShapeToGrid() {
        const app = useNuxtApp();
        const index = Math.round(Math.random() * (Shapes.length - 1));
        const bitmap = HObjects.clone(Shapes[index]);
        const shape = new Shape({ bitmap });
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
}
