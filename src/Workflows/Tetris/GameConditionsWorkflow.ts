import { Grid } from "~~/src/Models/Grid";
import { MainWorkflow } from "~~/src/Workflows/Tetris/MainWorkflow";

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
        return false;
    }

    /**
     * Проверяет что игра закончена
     * @returns
     */
    checkGameOver(): boolean {
        return false;
    }

    /**
     * Проверяет заполненные линии сетки
     */
    checkLinesFilled() {
    }
}
