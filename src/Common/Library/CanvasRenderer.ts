import { MGrid } from '~~/src/Common/Models/MGrid'

const DOT_SIZE = 12

/**
 * Рендерит сетку MGrid на канвас
 */
export class CanvasRenderer {
    #grid: MGrid
    #fps: number
    #canvas: HTMLCanvasElement
    #renderingIntervalPointer = null
    #ctx: CanvasRenderingContext2D

    constructor(grid: MGrid, fps: number) {
        this.#grid = grid
        this.#fps = fps
    }

    get canvas() {
        return this.#canvas
    }

    setСanvas(canvas: HTMLCanvasElement) {
        this.#canvas = canvas
    }

    /**
     * Запускает цикл рендеринга канваса
     */
    run() {
        this.#canvas.width = Number(
            this.#grid.width * DOT_SIZE + this.#grid.width
        )
        this.#canvas.height = Number(
            this.#grid.height * DOT_SIZE + this.#grid.height
        )
        this.#ctx = this.#canvas.getContext('2d')

        const delay = Math.round(1000 / this.#fps)
        this.#renderingIntervalPointer = setInterval(() => {
            this.renderFrame()
        }, delay)
    }

    /**
     * Рендерит один фрейм канваса
     */
    renderFrame() {
        const ctx = this.#ctx
        const grid = this.#grid.render()
        let topOffset = 0
        let leftOffset = 0
        ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height)

        for (const row of grid) {
            for (const cell of row) {
                if (cell) {
                    ctx.fillRect(leftOffset, topOffset, DOT_SIZE, DOT_SIZE)
                    ctx.clearRect(
                        leftOffset + 1,
                        topOffset + 1,
                        DOT_SIZE - 2,
                        DOT_SIZE - 2
                    )
                    ctx.fillRect(
                        leftOffset + 3,
                        topOffset + 3,
                        DOT_SIZE - 6,
                        DOT_SIZE - 6
                    )
                }

                leftOffset += DOT_SIZE + 1
            }

            topOffset += DOT_SIZE + 1
            leftOffset = 0
        }
    }

    /**
     * Завершает цикл рендеринга
     */
    destroy() {
        this.#renderingIntervalPointer &&
            clearInterval(this.#renderingIntervalPointer)
    }
}
