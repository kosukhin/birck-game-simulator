import { HObjects } from '~~/src/common/utils/HObjects'

export class HArray {
  static rotate90(a: any[]) {
    const w = a.length
    const h = a[0].length
    const b = new Array(h)

    for (let y = 0; y < h; y++) {
      b[y] = new Array(w)

      for (let x = 0; x < w; x++) {
        b[y][x] = a[w - 1 - x][y]
      }
    }

    return b
  }

  static rotate180(a: any[]) {
    return HArray.rotate90(HArray.rotate90(a))
  }

  static rotate270(a: any[]) {
    return HArray.rotate180(HArray.rotate90(a))
  }

  static isAllElementsEqualsTo(arr: any[], equalsTo: number): boolean {
    return arr.reduce((acc, item) => {
      return acc && item === equalsTo
    }, true)
  }

  static createTwoDemGrid(width: number, height: number) {
    const newGrid = []

    for (let i = 0; i < height; i++) {
      newGrid[i] || (newGrid[i] = [])

      for (let j = 0; j < width; j++) {
        newGrid[i][j] = 0
      }
    }

    return newGrid
  }

  static shuffle(array: any[]) {
    const result = HObjects.clone(array)

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }

    return result
  }

  static createEmptyRow(width: number) {
    const newRow = []

    for (let i = 0; i < width; i++) {
      newRow[i] = 0
    }

    return newRow
  }
}
