import { Game, GameSettings } from '~/src/common/types/Game'
import { EMoveDirection } from '~/src/common/types/GameTypes'
import { isReverseDirection } from '~/src/common/utils/game'

export const destroy = (gameSettings: GameSettings) => {
  gameSettings.isGameOver = true
}

export const changeDirection = (
  gameSettings: GameSettings,
  newDirection: EMoveDirection
) => {
  if (isReverseDirection(gameSettings.direction, newDirection)) {
    return
  }

  gameSettings.direction = newDirection
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
