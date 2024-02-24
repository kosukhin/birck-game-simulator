import { uniqueId } from 'lodash'
import { renderShapeToGrid } from '~/src/common/utils/render'
import { blasteroidEnemies } from '~/src/blasteroid/providers/constants'
import { BlasteroidGame } from '~/src/blasteroid/providers/types'
import { calculateShapeHeight } from '~/src/common/utils/bounds'
import { Shape } from '~/src/common/types/Block'
import { EMoveDirection } from '~/src/common/types/GameTypes'
import { HMath } from '~/src/common/utils/HMath'

export const createEnemy = (game: BlasteroidGame) => {
  const enemyPrefix = 'enemy_'
  const group = 'enemy'
  const enemyShapeIndex = HMath.random(0, blasteroidEnemies.length - 1)
  game.enemy = {
    x: HMath.random(0, game.grid.gameSize.width - 5),
    y: -1,
    height: 3,
    direction: EMoveDirection.down,
    blocks: blasteroidEnemies[enemyShapeIndex].map((blockShape) => ({
      ...blockShape,
      id: uniqueId(enemyPrefix),
      group,
    })),
  }
  renderShapeToGrid(game.enemy, game.grid)
  game.enemy.height = calculateShapeHeight(game.enemy, game)
}

export const createShoot = (
  fromShape: Shape,
  xDelta: number,
  game: BlasteroidGame
) => {
  const shoot: Shape = {
    x: fromShape.x + xDelta,
    y: fromShape.y,
    height: 1,
    width: 1,
    direction: EMoveDirection.up,
    blocks: [{ x: 0, y: 0, id: uniqueId('shoot_'), group: 'shoot' }],
  }
  renderShapeToGrid(shoot, game.grid)

  return shoot
}

export const createBlasteroid = (game: BlasteroidGame) => {
  game.blasteroid = {
    x: 0,
    y: game.grid.gameSize.height - 2,
    direction: EMoveDirection.up,
    width: 3,
    height: 2,
    blocks: [
      { x: 1, y: 0, id: uniqueId('blas_'), group: 'blasteroid' },
      { x: 0, y: 1, id: uniqueId('blas_'), group: 'blasteroid' },
      { x: 1, y: 1, id: uniqueId('blas_'), group: 'blasteroid' },
      { x: 2, y: 1, id: uniqueId('blas_'), group: 'blasteroid' },
    ],
  }
  renderShapeToGrid(game.blasteroid, game.grid)
}
