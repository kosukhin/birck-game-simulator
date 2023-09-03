import { Ref } from 'nuxt/dist/app/compat/capi'
import { ref } from 'vue'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { MShape } from '~~/src/Common/Models/MShape'
import { EMoveDirection, IGameWorkflow } from '~~/src/Common/Types/GameTypes'
import { useService } from '~~/src/Common/Helpers/HService'
import { SConnectors } from '~~/src/Common/Services/SConnectors'
import { Bot } from '~~/src/Tanks/Library/Bot'
import { Shoot } from '~~/src/Common/Library/Shoot'
import { HMath } from '~~/src/Common/Helpers/HMath'
import { Shapes } from '~~/src/Tanks/Data/Shapes'
import { ShapeMover } from '~~/src/Common/Library/ShapeMover'
import { HApp } from '~~/src/Common/Helpers/HApp'

const SHOOT_SPEED = 50

/**
 * Главная логика игры танки
 */
export class WfTanks implements IGameWorkflow {
  /** Основная сетка игры */
  #grid: MGrid
  /** Танк игрока */
  #tank: MShape
  /** Флаг игра закончена */
  #isGameOver: Ref<boolean>
  /** Счет игры */
  #score: Ref<number>
  /** Боты */
  #bots: Bot[] = []
  /** Логика перемещения танка */
  #shapeMover: ShapeMover = new ShapeMover()
  /** Флаг остановлена игра или нет */
  #isPaused: boolean = false
  #afterNextFrame!: Function
  #shoots: Shoot[] = []
  #events: Record<string, Function> = {}

  constructor() {
    this.#grid = new MGrid({
      height: 20,
      width: 20,
    })
    this.#score = ref(0)
    this.#grid.createEmptyGrid()
    this.#isGameOver = ref(false)
    this.#tank = new MShape({
      id: 'tank',
      bitmap: Shapes.player,
      direction: EMoveDirection.down,
    })
    this.#bots.push(
      new Bot({
        grid: this.#grid,
        enemy: this.#tank,
        position: [this.#grid.maxX, this.calculateMaxHeight()],
        direction: EMoveDirection.up,
      })
    )
    this.#grid.addShape(this.#tank)
  }

  get grid() {
    return this.#grid
  }

  get isGameOver() {
    return this.#isGameOver
  }

  get score() {
    return this.#score
  }

  get tank() {
    return this.#tank
  }

  get bots() {
    return this.#bots
  }

  /**
   * Запускает игру танки
   */
  async run() {
    await HApp.wait(SHOOT_SPEED)
    useService<SConnectors>('connectors').browser.requestAnimationFrame(() => {
      if (this.#isPaused) {
        return
      }

      // Если нету врагов, добавляем еще бота
      if (this.#grid.shapesCount <= 1) {
        this.#bots.push(
          new Bot({
            grid: this.#grid,
            enemy: this.#tank,
            position: [this.#grid.maxX, this.calculateMaxHeight()],
            direction: EMoveDirection.up,
            type: 1,
          })
        )

        if (this.#score.value >= 10) {
          this.#bots.push(
            new Bot({
              grid: this.#grid,
              enemy: this.#tank,
              position: [
                HMath.round(this.#grid.maxX / 2),
                this.calculateMaxHeight(),
              ],
              direction: EMoveDirection.up,
              type: 2,
            })
          )
        }

        if (this.#score.value >= 20) {
          this.#bots.push(
            new Bot({
              grid: this.#grid,
              enemy: this.#tank,
              position: [0, this.calculateMaxHeight()],
              direction: EMoveDirection.up,
              type: 3,
            })
          )
        }
      }

      this.#bots.forEach((bot) => {
        if (!bot.hasAfterShoot) {
          bot.afterShoot(() => {
            this.#events.afterShoot && this.#events.afterShoot()
          })
        }
      })

      this.checkGameOver()
      !this.#isGameOver.value && this.run()
      this.#afterNextFrame && this.#afterNextFrame()
    })
  }

  afterNextFrame(cb: Function) {
    this.#afterNextFrame = cb
  }

  /**
   * {@inheritDoc IGameWorkflow}
   */
  pause() {
    this.#isPaused = !this.#isPaused

    if (!this.#isPaused) {
      this.run()
    }

    // Останавливаем логику ботов
    this.#bots.forEach((bot) => {
      bot.pause()
    })
  }

  /**
   * Обеспечивает передвижение танка
   * @param direction
   */
  moveTank(direction: EMoveDirection) {
    if (this.#isPaused) {
      return
    }

    if (this.#tank.direction === direction) {
      this.#shapeMover.move(this.#tank, direction)
    }

    this.#tank.setDirection(direction)
  }

  /**
   * Проверяет что игра закончена
   * Игра будет закончена если танк игрока уничтожен
   */
  checkGameOver() {
    const isTankAlive = this.#grid.hasShape(this.#tank)
    this.#isGameOver.value = !isTankAlive
    if (this.#isGameOver.value) {
      this.#events.hit && this.#events.hit()
    }
  }

  get shoots() {
    return this.#shoots
  }

  /**
   * Стреляет танк
   */
  shoot() {
    if (this.#isPaused) {
      return
    }

    const shoot = new Shoot({
      direction: this.#tank.direction,
      fromShape: this.#tank,
      grid: this.#grid,
      position: [this.#tank.midX, this.#tank.midY],
    })

    this.#shoots.push(shoot)
    this.#events.afterShoot && this.#events.afterShoot()

    // Подписываемся на попадание
    shoot.hitTheTarget.registerSubscriber((target) => {
      if (target !== this.#tank) {
        this.increaseScore()
        this.#events.hit && this.#events.hit()
      }
    })
  }

  /**
   * Увеличивает счет игры на 1
   */
  increaseScore() {
    this.#score.value++
  }

  /**
   * Рассчитывает максимальную высоту для установки танка
   * @returns
   */
  calculateMaxHeight() {
    return this.#grid.maxY - this.#tank.height + 1
  }

  addEvent(name: string, cb: Function) {
    this.#events[name] = cb
  }
}
