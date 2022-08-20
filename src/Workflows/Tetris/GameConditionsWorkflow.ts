/**
 * Процесс отвечающий за выполнение основных
 * условий игры.
 */
export class GameConditionsWorkflow {
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
