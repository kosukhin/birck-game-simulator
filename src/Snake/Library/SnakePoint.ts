import { HApp } from '~~/src/Common/Helpers/HApp'

export class SnakePoint {
  #x = 0
  #y = 0
  #id = 'id'

  constructor(x: number, y: number) {
    this.#x = x
    this.#y = y
    this.#id = HApp.uniqueId('snake_point_')
  }

  get x() {
    return this.#x
  }

  get y() {
    return this.#y
  }

  get id() {
    return this.#id
  }

  setPosition(x: number, y: number) {
    this.#x = x
    this.#y = y
  }
}
