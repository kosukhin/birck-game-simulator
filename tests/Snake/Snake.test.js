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

test('snake ate target', () => {
    const game = new WfSnake()
    game.run()
        .then(() => {
            // Помещаем точку ближе к змейке
            game.target.setPosition([4, 0])
            jest.runAllTimers()
            expect(game.snake.points.length).toBe(2)
        })
        .then(() => {
            expect(game.snake.points.length).toBe(3)
        })
    jest.runAllTimers()
})

test('snake cross top bound', () => {
    const game = new WfSnake()
    game.run()
        .then(() => {
            expect(game.isGameOver.value).toBe(false)
            game.moveSnake(EMoveDirection.up)
            jest.runAllTimers()
        })
        .then(() => {
            expect(game.isGameOver.value).toBe(true)
        })
    jest.runAllTimers()
})

test('snake ate itself', () => {
    const game = new WfSnake()
    game.snake.addPointToEnd()
    game.snake.addPointToEnd()
    game.snake.addPointToEnd()
    game.snake.addPointToEnd()
    game.snake.leadPoint.setPosition(6, 0)
    game.run()
        .then(() => {
            expect(game.isGameOver.value).toBe(false)
            game.moveSnake(EMoveDirection.down)
            jest.runAllTimers()
        })
        .then(() => {
            expect(game.isGameOver.value).toBe(false)
            game.moveSnake(EMoveDirection.left)
            jest.runAllTimers()
        })
        .then(() => {
            expect(game.isGameOver.value).toBe(false)
            game.moveSnake(EMoveDirection.up)
            jest.runAllTimers()
        })
        .then(() => {
            expect(game.isGameOver.value).toBe(true)
        })
    jest.runAllTimers()
})
