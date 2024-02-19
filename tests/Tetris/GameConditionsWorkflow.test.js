import { MShape } from '~~/src/common/models/MShape'
import { WfTetrisConditions } from '~~/src/Tetris/Workflows/WfTetrisConditions'
import { WfTetris } from '~~/src/Tetris/Workflows/WfTetris'

const gameConditionsFactory = () => {
  const game = new WfTetris()
  game.grid.addShape(
    new MShape({
      bitmap: [
        [1, 1],
        [1, 1],
      ],
    })
  )
  return [new WfTetrisConditions(game.grid), game]
}

test('check can shape move next', () => {
  const [gameConditions, game] = gameConditionsFactory()
  const shape = game.grid.getFirstShape()
  expect(gameConditions.canShapeMoveNext()).toBe(true)

  // Не можем двигаться мы в конце
  shape.setY(13)
  expect(gameConditions.canShapeMoveNext()).toBe(false)
})

test('check game over', () => {
  const [gameConditions, game] = gameConditionsFactory()
  game.grid.setGrid([
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ])
  expect(gameConditions.checkGameOver()).toBe(true)

  game.grid.setGrid([
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ])
  expect(gameConditions.checkGameOver()).toBe(false)
})

test('check lines filled', () => {
  const [gameConditions, game] = gameConditionsFactory()
  game.grid.setGrid([
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [1, 1, 1, 1],
  ])
  expect(gameConditions.checkLinesFilled()).toEqual([3])

  game.grid.setGrid([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
  ])
  expect(gameConditions.checkLinesFilled()).toEqual([2, 3])
})
