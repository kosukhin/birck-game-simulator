import { Ref } from 'nuxt/dist/app/compat/capi'
import { ref } from 'vue'
import { MGrid } from '~~/src/Models/MGrid'

/**
 * Змейка логика игры
 */
export class WfMain {
    #grid: MGrid

    /**
     * Счетчик необходимый для формирования ключа обновления сетки
     */
    #updateCounter: Ref<number>

    constructor() {
        this.#grid = new MGrid({})
        this.#grid.createEmptyGrid()
        this.#updateCounter = ref(0)
    }

    run() {}

    /**
     * Отдаем сетку на рендеринг из этого процесса
     */
    get grid(): MGrid {
        return this.#grid
    }

    /**
     * Отдает счетчик обновления интерфейса
     */
    get updateCounter() {
        return this.#updateCounter
    }
}
