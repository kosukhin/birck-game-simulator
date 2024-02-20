export class Cube {
  id: any
  color: any
  #x: number
  #y: number

  get x() {
    return this.#x
  }

  get y() {
    return this.#y
  }

  constructor(x: number, y: number) {
    this.#x = x
    this.#y = y
  }

  getPosition() {
    return {
      x: this.#x,
      y: this.#y,
    }
  }

  setPosition(x: number, y: number) {
    this.#x = x
    this.#y = y
  }
}
