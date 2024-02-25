import partial from 'lodash/partial'
import { repeat } from '~/src/common/utils/actions'
import { ensureNotGameOver, ensureNotPaused } from '~/src/common/utils/checks'
import {
  booleanToPromise,
  noError,
  skipNextThens,
  whenFrameReady,
} from '~/src/common/utils/fp'
import { renderBlocksToGrid } from '~/src/common/utils/render'
import {
  snakeInitialBlocks,
  snakeInitialTarget,
} from '~/src/snake/providers/constants'
import { SnakeGame } from '~/src/snake/providers/types'
import { checkTargetEated, isGameOver } from '~/src/snake/utils/checks'
import { changeDirection, destroy, moveForward } from '~/src/snake/utils/flow'
import { moveTargetToRandomPlace } from '~/src/snake/utils/render'
import { Game, GameGrid, GameSettings } from '~~/src/common/types/Game'
import { FType, debug } from '~~/src/common/utils/system'

export const useSnake = (
  getGameSettings: FType<GameSettings>,
  getGameGrid: FType<GameGrid>
) => {
  const game: SnakeGame = {
    grid: getGameGrid(),
    settings: getGameSettings(),
    target: snakeInitialTarget,
    snake: snakeInitialBlocks,
  }

  renderBlocksToGrid([game.target], game.grid)
  renderBlocksToGrid(game.snake, game.grid)
  moveTargetToRandomPlace(game.grid)

  return {
    changeDirection: partial(changeDirection, game.settings),
    pause() {
      game.settings.isPaused = !game.settings.isPaused
      !game.settings.isPaused && startGame(game)
    },
    start: startGame.bind(null, game),
    destroy: partial(destroy, game.settings),
  }
}

const renderGameFrame = (game: Game) => {
  game.settings.frameCounter += 1
  whenFrameReady(game)
    .then(moveForward)
    .then(booleanToPromise('game is over', () => !isGameOver(game)))
    .catch(destroy.bind(null, game.settings))
    .catch(skipNextThens)
    .then(checkTargetEated)
    .catch(noError)
  return game
}

const startGame = (game: Game): Promise<Game> =>
  whenFrameReady(game)
    .then(ensureNotGameOver)
    .then(ensureNotPaused)
    .catch(skipNextThens)
    .then(renderGameFrame)
    .then(
      repeat(
        () => startGame(game),
        () => game.settings.speed
      )
    )
    .catch(noError)
