import { MShape } from '~~/src/common/models/MShape'

test('clear empty rows', () => {
  const shape = new MShape({
    bitmap: [
      [1, 1, 1],
      [1, 1, 1],
    ],
  })
  expect(shape.height).toBe(2)
  shape.removePixel(0, 1)
  shape.removePixel(1, 1)
  shape.removePixel(2, 1)
  // После удаления 3-х пикселей высота фигуры с 2 должна стать 1
  expect(shape.height).toBe(1)
})
