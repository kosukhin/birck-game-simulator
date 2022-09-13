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
    expect(game.snake.leadPoint.x).toBe(2)

    jest.runAllTimers()

    game.afterFrameRendered.registerSubscriber(() => {
        expect(game.snake.leadPoint.x).toBe(3)
    })
    game.afterFrameRendered.clearSubscribers()
})

test('snake game move y', () => {
    const game = new WfSnake()
    game.run()
    game.moveSnake(EMoveDirection.down)
    expect(game.snake.leadPoint.y).toBe(0)

    jest.runAllTimers()

    game.afterFrameRendered.registerSubscriber(() => {
        expect(game.snake.leadPoint.y).toBe(1)
    })
    game.afterFrameRendered.clearSubscribers()
})
