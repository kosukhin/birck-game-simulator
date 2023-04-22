export class SnakePoint {
  #x = 0
  #y = 0

  constructor(x: number, y: number) {
    this.#x = x
    this.#y = y
  }

  get x() {
    return this.#x
  }

  get y() {
    return this.#y
  }

  setPosition(x: number, y: number) {
    this.#x = x
    this.#y = y
  }
}
