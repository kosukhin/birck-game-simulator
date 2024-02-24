import { throttle } from 'lodash'
import {
  blasteroidShootDelay,
  blasteroidShootSpeed,
} from '~/src/blasteroid/providers/constants'
import { BlasteroidGame } from '~/src/blasteroid/providers/types'
import {
  checkEnemyShooted,
  ensureFieldIsNull,
  removeShootIfStopped,
} from '~/src/blasteroid/utils/checks'
import {
  createBlasteroid,
  createEnemy,
  createShoot,
} from '~/src/blasteroid/utils/factories'
import { moveBlasteroidByX } from '~/src/blasteroid/utils/render'
import { repeat } from '~/src/common/utils/actions'
import {
  ensureNotGameOver,
  ensureNotPaused,
  ensureShapeInBoundsByXAxis,
  ensureShapeInBoundsByYAxis,
} from '~/src/common/utils/checks'
import { checkGameOver } from '~/src/common/utils/game'
import { moveShapeToDirection } from '~/src/common/utils/render'
import { Shape } from '~~/src/common/types/Block'
import { Game, GameGrid, GameSettings } from '~~/src/common/types/Game'
import { noError, resolve, skipNextThens } from '~~/src/common/utils/fp'
import { FType } from '~~/src/common/utils/system'

export const useBlasteroid = (
  getGameSettings: FType<GameSettings>,
  getGameGrid: FType<GameGrid>
) => {
  const game: BlasteroidGame = {
    grid: getGameGrid(),
    settings: getGameSettings(),
    blasteroid: null,
    enemy: null,
  }

  return {
    start() {
      safeCreateBlasteroid(game)
      startGame(game)
    },
    pause() {
      game.settings.isPaused = !game.settings.isPaused
      !game.settings.isPaused && startGame(game)
    },
    moveByX(step: number) {
      game.blasteroid && safeMoveByX(game, game.blasteroid, step)
    },
    shoot: throttle(() => {
      game.blasteroid &&
        [
          createShoot(game.blasteroid, 0, game),
          createShoot(game.blasteroid, 2, game),
        ].forEach((shoot) => animateShoot(game, shoot))
    }, blasteroidShootDelay),
  }
}

const animateShoot: any = (game: BlasteroidGame, shoot: Shape) =>
  resolve(game)
    .then(ensureNotGameOver)
    .then(ensureNotPaused)
    .then(ensureShapeInBoundsByYAxis(shoot))
    .catch(skipNextThens)
    .then(moveShapeToDirection(shoot) as any)
    .then(checkEnemyShooted(shoot))
    .then(repeat(() => animateShoot(game, shoot), blasteroidShootSpeed))
    .catch(removeShootIfStopped(shoot, game))

const startGame = (game: Game): Promise<Game> =>
  resolve(game)
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

const renderGameFrame = (game: BlasteroidGame) => {
  game.settings.frameCounter += 1
  resolve(game)
    .then(ensureFieldIsNull('enemy'))
    .catch(skipNextThens)
    .then(createEnemy)
    .catch(noError)

  game.enemy &&
    resolve(game)
      .then(ensureShapeInBoundsByYAxis(game.enemy))
      .catch(skipNextThens)
      .then(moveShapeToDirection(game.enemy))
      .catch(checkGameOver(game))

  return game
}

const safeCreateBlasteroid = (game: BlasteroidGame) =>
  resolve(game)
    .then(ensureFieldIsNull('blasteroid'))
    .catch(skipNextThens)
    .then(createBlasteroid)
    .catch(noError)

const safeMoveByX = (game: BlasteroidGame, blasteroid: Shape, step: number) =>
  resolve(game)
    .then(ensureNotGameOver)
    .then(ensureNotPaused)
    .then(ensureShapeInBoundsByXAxis(blasteroid, step))
    .catch(skipNextThens)
    .then(moveBlasteroidByX(step))
    .catch(noError)
