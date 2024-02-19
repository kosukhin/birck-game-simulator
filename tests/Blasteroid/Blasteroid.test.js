import { WfBlasteroid } from '~~/src/Blasteroid/Workflows/WfBlasteroid'
import { EMoveDirection } from '~~/src/common/types/GameTypes'

jest.useFakeTimers()

beforeEach(() => {
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb())
})

afterEach(() => {
  window.requestAnimationFrame.mockRestore()
})

test('blasteroid move', () => {
  const game = new WfBlasteroid()
  game
    .run()
    .then(() => {
      expect(game.blasteroid.x).toBe(6)
      game.move(EMoveDirection.right)
      jest.runAllTimers()
    })
    .then(() => {
      expect(game.blasteroid.x).toBe(7)
      game.move(EMoveDirection.right)
      jest.runAllTimers()
    })
    .then(() => {
      expect(game.blasteroid.x).toBe(8)
    })
  jest.runAllTimers()
})
