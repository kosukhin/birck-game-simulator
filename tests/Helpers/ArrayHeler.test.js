import { HArray } from '~~/src/Common/Helpers/HArray'

test('array rotation', () => {
  const arr = [
    [0, 0],
    [1, 1],
  ]
  const afterRotateArr = [
    [1, 0],
    [1, 0],
  ]
  expect(HArray.rotate90(arr)).toEqual(afterRotateArr)
})

test('all elements equals', () => {
  expect(HArray.isAllElementsEqualsTo([1, 1, 1], 1)).toBe(true)
  expect(HArray.isAllElementsEqualsTo([0, 0, 0], 0)).toBe(true)
  expect(HArray.isAllElementsEqualsTo([0, 0, 1], 0)).toBe(false)
})
