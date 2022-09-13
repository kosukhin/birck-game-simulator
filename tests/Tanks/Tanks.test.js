import { EMoveDirection } from '~~/src/Common/Types/GameTypes'
import { WfTanks } from '~~/src/Tanks/Workflows/WfTanks'

jest.useFakeTimers()

beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb())
})

afterEach(() => {
    window.requestAnimationFrame.mockRestore()
})

test('tanks game moves', () => {
    const game = new WfTanks()
    game.run()
        .then(() => {
            expect(game.tank.x).toBe(0)
            game.moveTank(EMoveDirection.right)
            game.moveTank(EMoveDirection.right)
            jest.runAllTimers()
        })
        .then(() => {
            expect(game.tank.x).toBe(1)
        })
    jest.runAllTimers()
})
