import { HMath } from '~~/src/Common/Helpers/HMath'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { MShape } from '~~/src/Common/Models/MShape'
import { EMoveDirection } from '~~/src/Common/Types/GameTypes'
import { Shapes } from '~~/src/Tanks/Data/Shapes'
import { Shoot } from '~~/src/Tanks/Library/Shoot'

interface IBotParams {
    grid: MGrid
    enemy: MShape
    position: [number, number]
    direction: EMoveDirection
}

/**
 * Представление бота
 */
export class Bot {
    /** Сетка игры, чтобы видеть игрока */
    #grid: MGrid
    /** Объект фигуры игрока */
    #enemy: MShape
    /** Фигура танка этого бота */
    #tank: MShape
    /** Интервал обновления логики бота */
    #runTimeInterval: any
    /** Последний выстрел */
    #lastShoot: Shoot
    /** Бот отсновлен */
    #isPaused: boolean = false

    constructor(params: IBotParams) {
        this.#grid = params.grid
        this.#enemy = params.enemy
        this.#tank = new MShape({
            bitmap: Shapes.tank,
            x: params.position[0],
            y: params.position[1],
            direction: params.direction,
        })
        this.#grid.addShape(this.#tank)
        this.run()
    }

    /**
     * Запускает логику работы бота
     */
    run() {
        this.#runTimeInterval = setInterval(() => {
            // Убиваем цикл если нету врага либо нету танка этого бота
            if (
                !this.#grid.hasShape(this.#tank) ||
                !this.#grid.hasShape(this.#enemy)
            ) {
                clearInterval(this.#runTimeInterval)
                return
            }

            // 1 Определить находится ли враг на одной линии с танком бота
            const isSameX =
                this.#enemy.x <= this.#tank.midX &&
                this.#tank.midX <= this.#enemy.maxX
            const isSameY =
                this.#enemy.y <= this.#tank.midY &&
                this.#tank.midY <= this.#enemy.maxY

            if (isSameX || isSameY) {
                // 2. если находится, то определить направление стрельбы и сделать шаг в это направление, затем выстрел
                let shootDirection = EMoveDirection.up

                if (isSameX && this.#tank.midX <= this.#enemy.midX) {
                    shootDirection = EMoveDirection.down
                }

                if (isSameX && this.#tank.midX >= this.#enemy.midX) {
                    shootDirection = EMoveDirection.up
                }

                if (isSameY && this.#tank.midY >= this.#enemy.midY) {
                    shootDirection = EMoveDirection.left
                }

                if (isSameY && this.#tank.midY <= this.#enemy.midY) {
                    shootDirection = EMoveDirection.right
                }

                this.#tank.setDirection(shootDirection)
                this.shoot()
            } else {
                // 3 если не находится то определяем минимальную дистанцию чтобы встать на одну линию и делаем шаг в эту сторону
                const xDistance =
                    this.#tank.midX - this.#enemy.midX + HMath.random(0, 4)
                const yDistance =
                    this.#tank.midY - this.#enemy.midY + HMath.random(0, 4)

                if (Math.abs(yDistance) < Math.abs(xDistance)) {
                    const step = yDistance < 0 ? 1 : -1
                    this.#tank.setDirection(
                        yDistance < 0 ? EMoveDirection.down : EMoveDirection.up
                    )
                    // Двигаемся по y
                    this.#tank.moveY(step)
                } else {
                    const step = xDistance < 0 ? 1 : -1
                    this.#tank.setDirection(
                        xDistance < 0
                            ? EMoveDirection.right
                            : EMoveDirection.left
                    )
                    // Двигаемся по x
                    this.#tank.moveX(step)
                }
            }
        }, 200)
    }

    /**
     * Выстрел бота
     */
    shoot() {
        this.#lastShoot = new Shoot({
            direction: this.#tank.direction,
            fromShape: this.#tank,
            grid: this.#grid,
            position: [this.#tank.midX, this.#tank.midY],
        })
    }

    /**
     * Останавливает работу бота
     */
    stop() {
        clearInterval(this.#runTimeInterval)
    }

    /**
     * Останавливает или возобновляет работу бота
     */
    pause() {
        this.#isPaused = !this.#isPaused

        if (!this.#isPaused) {
            this.run()
        } else {
            this.stop()
        }
    }
}
