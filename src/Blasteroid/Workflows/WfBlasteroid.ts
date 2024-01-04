import { Ref } from 'nuxt/dist/app/compat/capi'
import { ref } from 'vue'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { EMoveDirection, IGameWorkflow } from '~~/src/Common/Types/GameTypes'
import { MShape } from '~~/src/Common/Models/MShape'
import { Shapes } from '~~/src/Blasteroid/Data/Shapes'
import { Shoot } from '~~/src/Common/Library/Shoot'
import { HMath } from '~~/src/Common/Helpers/HMath'
import { TGrid } from '~~/src/Common/Types/GridTypes'
import { HApp } from '~~/src/Common/Helpers/HApp'
import { useService } from '~~/src/Common/Helpers/HService'
import { SConnectors } from '~~/src/Common/Services/SConnectors'
import { HObjects } from '~~/src/Common/Helpers/HObjects'

export class WfBlasteroid implements IGameWorkflow {
  #grid: MGrid
  #blasteroid: MShape
  #target!: MShape
  #isGameOver: Ref<boolean>
  #score: Ref<number>
  #speed: Ref<number>
  #isPaused: boolean
  #shoots: Record<string, Shoot> = {}
  #afterNextFrame?: Function
  #afterTargetBeated?: Function

  constructor() {
    this.#grid = new MGrid({
      height: 20,
      width: 15,
    })
    this.#grid.createEmptyGrid()
    this.#blasteroid = new MShape({
      bitmap: Shapes.get('blasteroid') as TGrid,
      x: 0,
      y: this.#grid.maxY - 1,
    })
    this.#blasteroid.setX(
      HMath.round(this.#grid.width / 2) -
        HMath.round(this.#blasteroid.width / 2)
    )
    this.#grid.addShape(this.#blasteroid)
    this.#isGameOver = ref(false)
    this.#speed = ref(400)
    this.#score = ref(0)
    this.#isPaused = false
  }

  get grid(): MGrid {
    return this.#grid
  }

  get score() {
    return this.#score
  }

  get speed() {
    return this.#speed
  }

  get isGameOver() {
    return this.#isGameOver
  }

  get blasteroid() {
    return this.#blasteroid
  }

  get target() {
    return this.#target
  }

  get shoots() {
    return this.#shoots
  }

  async run() {
    if (this.#isPaused) {
      return
    }

    await HApp.wait(this.#speed.value)
    useService<SConnectors>('connectors').browser.requestAnimationFrame(() => {
      if (
        !this.#target ||
        this.#target.isShapeEmpty() ||
        !this.#grid.hasShape(this.#target)
      ) {
        if (this.#target) {
          this.#grid.removeShape(this.#target)
        }

        const randomShape = HObjects.clone(
          // @ts-ignore
          Shapes.get('shapes')[HMath.random(0, Shapes.get('shapes').length - 1)]
        )
        this.#target = new MShape({
          bitmap: randomShape as TGrid,
        })
        this.#target.setX(
          HMath.round(this.#grid.width / 2) -
            HMath.round(this.#target.width / 2) +
            HMath.random(1, 3) * (HMath.random(0, 1) === 0 ? -1 : 1)
        )

        this.#grid.addShape(this.#target)
        this.#afterTargetBeated?.()
      }

      this.#target.moveY(1)

      if (this.#target.maxY >= this.#grid.maxY) {
        this.#isGameOver.value = true
      }

      this.#afterNextFrame && this.#afterNextFrame()
      !this.#isGameOver.value && this.run()
    })
  }

  pause() {
    this.#isPaused = !this.#isPaused

    if (!this.#isPaused) {
      this.run()
    }
  }

  move(direction: EMoveDirection) {
    if (this.#isPaused) {
      return
    }

    if (direction === EMoveDirection.right) {
      this.#blasteroid.moveX(1)
    }

    if (direction === EMoveDirection.left) {
      this.#blasteroid.moveX(-1)
    }
  }

  shoot() {
    if (this.#isPaused) {
      return
    }

    const shoot1 = new Shoot({
      direction: EMoveDirection.up,
      fromShape: this.#blasteroid,
      grid: this.#grid,
      position: [this.#blasteroid.x, this.#blasteroid.midY],
      byPixel: true,
    })
    shoot1.hitTheTarget.registerSubscriber(
      this.targetShooted.bind(this, shoot1)
    )
    this.#shoots[shoot1.id] = shoot1

    const shoot2 = new Shoot({
      direction: EMoveDirection.up,
      fromShape: this.#blasteroid,
      grid: this.#grid,
      position: [this.#blasteroid.maxX, this.#blasteroid.midY],
      byPixel: true,
    })
    shoot2.hitTheTarget.registerSubscriber(
      this.targetShooted.bind(this, shoot2)
    )
    this.#shoots[shoot2.id] = shoot2
  }

  targetShooted(shoot: Shoot) {
    this.#score.value++

    if (this.#score.value % 10 === 0) {
      this.#speed.value -= 10
    }

    shoot.willBeRemoved = true
  }

  afterNextFrame(cb: Function) {
    this.#afterNextFrame = cb
  }

  afterTargetBeated(cb: Function) {
    this.#afterTargetBeated = cb
  }

  #events: Record<string, Function> = {}
  addEvent(name: string, cb: Function) {
    this.#events[name] = cb
  }
}
