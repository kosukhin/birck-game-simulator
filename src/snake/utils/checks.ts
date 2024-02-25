import { Game, GameGrid } from '~/src/common/types/Game'
import {
  addBlockToTail,
  moveTargetToRandomPlace,
} from '~/src/snake/utils/render'

export const isSnakeAteItSelf = (gameGrid: GameGrid) => {
  let isAte = false
  const [, lead, ...tail] = gameGrid.blocks

  tail.forEach((point) => {
    if (point.x === lead.x && point.y === lead.y) {
      isAte = true
    }
  })

  return isAte
}

export const isSnakeOutOfBounds = (gameGrid: GameGrid) => {
  const [, lead] = gameGrid.blocks
  const lessThanX = lead.x < 0
  const lessThanY = lead.y < 0
  const moreThanX = lead.x > gameGrid.gameSize.width - 1
  const moreThanY = lead.y > gameGrid.gameSize.height - 1

  return lessThanX || lessThanY || moreThanX || moreThanY
}

export const checkTargetEated = (game: Game) => {
  const [target, lead] = game.grid.blocks

  if (lead.x === target.x && lead.y === target.y) {
    moveTargetToRandomPlace(game.grid)
    addBlockToTail(game.grid)
    game.settings.score++
    game.settings.speed -= 10
  }

  return game
}

export const isGameOver = (game: Game) =>
  isSnakeOutOfBounds(game.grid) || isSnakeAteItSelf(game.grid)
