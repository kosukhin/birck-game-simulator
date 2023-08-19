import { Cube } from '~~/src/Common/Library/ThreeD/Entities/Cube'

export class RenderService {
  #cubes: Record<string, Cube> = {}

  createCube(id: string, x: number, y: number) {
    this.#cubes[id] = new Cube(x, y)
  }

  hasCube(id: string) {
    return !!this.#cubes[id]
  }

  updateCube(id: string, x: number, y: number) {
    const cube = this.#cubes[id]

    if (cube) {
      cube.setPosition(x, y)
    }
  }
}
