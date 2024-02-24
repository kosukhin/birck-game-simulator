import { curry } from 'lodash'
import { BlasteroidGame } from '~/src/blasteroid/providers/types'
import { calculateShapeHeight } from '~/src/common/utils/bounds'
import { Block, Shape } from '~/src/common/types/Block'
import { reject, resolve } from '~/src/common/utils/fp'

export const checkEnemyShooted = curry((shoot: Shape, game: BlasteroidGame) => {
  const shootBlock = shoot.blocks[0] as Block
  game.grid.blocks = game.grid.blocks.filter((block) => {
    if (
      block.group === 'enemy' &&
      shootBlock.x === block.x &&
      shootBlock.y === block.y
    ) {
      game.settings.score += 1
      game.settings.speed -= 1
      shoot.y -= 100
      game.enemy && (game.enemy.height = calculateShapeHeight(game.enemy, game))
      return false
    }
    return true
  })

  if (!game.grid.blocks.some((block) => block.group === 'enemy')) {
    game.enemy = null
  }

  return game
})

export const removeShootIfStopped = curry(
  (shoot: Shape, game: BlasteroidGame, context: any) => {
    game.grid.blocks = game.grid.blocks.filter(
      (block) => block.id !== shoot.blocks[0]?.id
    )
    return context
  }
)

export const ensureFieldIsNull = curry(
  (field: keyof BlasteroidGame, game: BlasteroidGame) => {
    return game[field] === null ? resolve(game) : reject('field is not null')
  }
)
