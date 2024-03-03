import partial from 'lodash/partial'
import { wrapWithCatch } from './../../common/utils/fp'
import { repeat } from '~/src/common/utils/actions'
import { ensureNotGameOver, ensureNotPaused } from '~/src/common/utils/checks'
import {
  booleanToPromise,
  whenFrameReady,
  wrapNoError,
} from '~/src/common/utils/fp'
import { pipePromise } from '~/src/common/utils/pipe'
import {
  incrementFrameCounter,
  renderBlocksToGrid,
} from '~/src/common/utils/render'
import {
  snakeInitialBlocks,
  snakeInitialTarget,
} from '~/src/snake/providers/constants'
import { SnakeGame } from '~/src/snake/providers/types'
import { checkTargetEated, isGameOver } from '~/src/snake/utils/checks'
import { changeDirection, destroy, moveForward } from '~/src/snake/utils/flow'
import { moveTargetToRandomPlace } from '~/src/snake/utils/render'
import { GameGrid, GameSettings } from '~~/src/common/types/Game'
import { FType } from '~~/src/common/utils/system'

export const useSnake = (
  getGameSettings: FType<GameSettings>,
  getGameGrid: FType<GameGrid>
) => {
  const game: SnakeGame = {
    grid: getGameGrid(),
    settings: getGameSettings(),
    target: snakeInitialTarget,
    snake: snakeInitialBlocks,
    speedMultiplier: 1,
  }

  renderBlocksToGrid([game.target], game.grid)
  renderBlocksToGrid(game.snake, game.grid)
  moveTargetToRandomPlace(game.grid)

  return {
    changeDirection: partial(changeDirection, game),
    pause() {
      game.settings.isPaused = !game.settings.isPaused
      !game.settings.isPaused && startGame(game)
    },
    start: startGame.bind(null, game),
    destroy: partial(destroy, game.settings),
  }
}

const renderGameFrame = wrapWithCatch(
  pipePromise(
    whenFrameReady,
    moveForward,
    booleanToPromise('game is over', (game: SnakeGame) => !isGameOver(game)),
    checkTargetEated,
    incrementFrameCounter
  ),
  (game: SnakeGame) => destroy(game.settings)
)

const startGame = wrapNoError(
  pipePromise(
    whenFrameReady,
    ensureNotGameOver,
    ensureNotPaused,
    renderGameFrame,
    repeat(
      (game: SnakeGame) => startGame(game),
      (game: SnakeGame) => game.settings.speed / game.speedMultiplier
    )
  )
)
