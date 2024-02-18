export class Cube {
  #x: number
  #y: number

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
