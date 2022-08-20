import { GameConditionsWorkflow } from "~~/src/Workflows/Tetris/GameConditionsWorkflow";

/**
 * Основной класс хода выполнения игры тетрис
 */
export class MainWorkflow {
    #conditions: GameConditionsWorkflow;

    constructor() {
        this.#conditions = new GameConditionsWorkflow();
    }

    /**
     * Запускает работы тетриса
     * @param runner
     */
    run() {

    }

    /**
     * Рендерит следующий фрейм игры,
     * полезно для пошаговой отладки
     */
    renderNextFrame() {

    }

    /**
     * Добавляет на сетку игры новую рандомную
     * фигуру, в центр сетки
     */
    addRandomShapeToGrid() {

    }

    /**
     * Создает пустую строку для сетки
     */
    createEmptyRow() {
    }

    /**
     * Создает пустую сетку
     */
    createEmptyGrid() {
    }
}
