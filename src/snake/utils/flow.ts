import { debounce } from 'lodash'
import { Game, GameSettings } from '~/src/common/types/Game'
import { EMoveDirection } from '~/src/common/types/GameTypes'
import { isReverseDirection } from '~/src/common/utils/game'
import { SnakeGame } from '~/src/snake/providers/types'

export const destroy = (gameSettings: GameSettings) => {
  gameSettings.isGameOver = true
}

const resetSpeedMultiplier = debounce((game: SnakeGame) => {
  game.speedMultiplier = 1
}, 100)

export const changeDirection = (
  game: SnakeGame,
  newDirection: EMoveDirection
) => {
  if (isReverseDirection(game.settings.direction, newDirection)) {
    return
  }

  if (game.settings.direction === newDirection) {
    game.speedMultiplier = 3
  }

  game.settings.direction = newDirection
  resetSpeedMultiplier(game)
}

export const moveForward = (game: Game) => {
  const [, loadPoint, ...tail] = game.grid.blocks

  let prevPointPosition = [loadPoint.x, loadPoint.y]
  tail.forEach((point) => {
    const position = [point.x, point.y]
    point.x = prevPointPosition[0]
    point.y = prevPointPosition[1]
    prevPointPosition = position
  })

  game.settings.direction === EMoveDirection.down && (loadPoint.y += 1)
  game.settings.direction === EMoveDirection.up && (loadPoint.y -= 1)
  game.settings.direction === EMoveDirection.right && (loadPoint.x += 1)
  game.settings.direction === EMoveDirection.left && (loadPoint.x -= 1)

  return game
}
