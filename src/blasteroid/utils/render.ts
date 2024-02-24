import { curry } from 'lodash'
import { BlasteroidGame } from '~/src/blasteroid/providers/types'

export const moveBlasteroidByX = curry((step: number, game: BlasteroidGame) => {
  game.blasteroid && (game.blasteroid.x += step)
  game.grid.blocks.forEach((block) => {
    if (block.group === 'blasteroid') {
      block.x += step
    }
  })
})
