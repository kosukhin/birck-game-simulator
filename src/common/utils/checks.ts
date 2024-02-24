import { curry } from 'lodash'
import { Shape } from '~/src/common/types/Block'
import { Game } from '~/src/common/types/Game'
import { reject, resolve } from '~/src/common/utils/fp'
import { calculateShapeStepToDirection } from '~/src/common/utils/render'

export const ensureShapeInBoundsByXAxis = curry(
  (shape: Shape, xDelta: number, game: Game) => {
    const nextX = shape.x + xDelta
    const shapeWidth = shape.width ?? 1

    return nextX >= 0 && nextX + shapeWidth <= game.grid.gameSize.width
      ? resolve(game)
      : reject('out of  bounds by x')
  }
)

export const ensureShapeInBoundsByYAxis = curry(
  (shape: Shape, game: Game): Promise<Game> => {
    const step = calculateShapeStepToDirection(shape)
    const nextY = shape.y + step.yDelta
    const shapeHeight = shape.height ?? 1

    return nextY >= 0 && nextY + shapeHeight <= game.grid.gameSize.height
      ? resolve(game)
      : reject('out of bounds by y')
  }
)

export const ensureNotGameOver = (v: Game) =>
  v.settings.isGameOver ? reject('game over') : resolve(v)

export const ensureNotPaused = (v: Game) =>
  v.settings.isPaused ? reject('game paused') : resolve(v)
