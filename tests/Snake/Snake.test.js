import { EMoveDirection } from '~~/src/Common/Types/GameTypes'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

jest.useFakeTimers()

beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb())
})

afterEach(() => {
    window.requestAnimationFrame.mockRestore()
})

test('snake game move x', () => {
    const game = new WfSnake()
    game.run()
        .then(() => {
            expect(game.snake.leadPoint.x).toBe(3)
            jest.runAllTimers()
        })
        .then(() => {
            expect(game.snake.leadPoint.x).toBe(4)
            jest.runAllTimers()
        })
        .then(() => {
            expect(game.snake.leadPoint.x).toBe(5)
        })
    jest.runAllTimers()
})

test('snake game move y', () => {
    const game = new WfSnake()
    game.moveSnake(EMoveDirection.down)
    game.run()
        .then(() => {
            expect(game.snake.leadPoint.y).toBe(1)
            jest.runAllTimers()
        })
        .then(() => {
            expect(game.snake.leadPoint.y).toBe(2)
            jest.runAllTimers()
        })
        .then(() => {
            expect(game.snake.leadPoint.y).toBe(3)
        })
    jest.runAllTimers()
})
