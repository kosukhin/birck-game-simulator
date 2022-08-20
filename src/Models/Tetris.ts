import { Ref } from "nuxt/dist/app/compat/capi";
import { Grid } from "~~/src/Models/Grid";

/**
 * Представление игры тетрис, храним тут
 * счет игры, скорость
 */
export class Tetris {
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

    constructor(grid: Grid) {
        this.#grid = grid;
        this.#score = ref(0);
        this.#speed = ref(500);
    }
}
