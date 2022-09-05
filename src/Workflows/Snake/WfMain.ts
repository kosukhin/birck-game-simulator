import { Ref } from 'nuxt/dist/app/compat/capi'
import { ref } from 'vue'
import { HLog } from '~~/src/Helpers/HLog'
import { HMath } from '~~/src/Helpers/HMath'
import { MGrid } from '~~/src/Models/MGrid'
import { MShape } from '~~/src/Models/MShape'

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
        this.#grid = new MGrid({
            height: 15,
            width: 15,
        })
        this.#grid.createEmptyGrid()
        this.#updateCounter = ref(0)
    }

    run() {
        this.addTargetDot()
    }

    /**
     * Добавляет на сетку точку за которой нужно двигаться
     * змейке
     */
    addTargetDot() {
        const dot = new MShape({ bitmap: [[1]] })
        const x = HMath.random(3, this.#grid.width - 1)
        const y = HMath.random(1, this.#grid.height - 1)
        dot.position = [x, y]
        this.#grid.addShape(dot)
        HLog.log('snake', dot.position)
    }

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
