import { random } from 'lodash'
import { repeat } from '~/src/common/utils/actions'
import { ensureNotGameOver, ensureNotPaused } from '~/src/common/utils/checks'
import {
  booleanToPromise,
  noError,
  resolve,
  skipNextThens,
  whenFrameReady,
} from '~/src/common/utils/fp'
import { rotationRules } from '~/src/tetris/providers/blocks'
import { Shape, TetrisGame } from '~/src/tetris/providers/types'
import { Block } from '~~/src/common/types/Block'
import { Game, GameGrid, GameSettings } from '~~/src/common/types/Game'
import { EMoveDirection } from '~~/src/common/types/GameTypes'
import { FType } from '~~/src/common/utils/system'

export const useTetris = (
  getGameSettings: FType<GameSettings>,
  getGameGrid: FType<GameGrid>
) => {
  const game: TetrisGame = {
    settings: getGameSettings(),
    grid: getGameGrid(),
    shape: null,
  }

  return {
    start: () => startGame(game),
    pause() {
      game.settings.isPaused = !game.settings.isPaused
      !game.settings.isPaused && startGame(game)
    },
    moveByX(x: number) {
      moveShapeByX(x, game)
    },
    moveDown() {
      moveShapeDown(game)
    },
    direction(newDirection: EMoveDirection) {
      rotateShape(newDirection, game)
    },
  }
}

// TOOD композиция
const checkLineFilled = (game: TetrisGame): number => {
  const filled = removeFilledLines(game.grid)
  if (filled) {
    game.shape = null
    fallStaticBlocks(game)
  }
  return filled
}

const moveShapeByX = (x: number, game: TetrisGame) => {
  resolve(game)
    .then(
      booleanToPromise(
        'shape stuck',
        () =>
          !(
            !game.shape ||
            isShapeStuckByWidth(x, game) ||
            isShapeStuckToBlockByX(game)
          )
      )
    )
    .catch(skipNextThens)
    .then(() => {
      moveShape({ x }, game.shape as Shape, game)
      return game
    })
    .catch(noError)
}

const moveShapeDown = (game: TetrisGame) =>
  resolve(game)
    .then(booleanToPromise('must stop shape', () => !checkShapeMustStop(game)))
    .catch(skipNextThens)
    .then((context: any) => {
      game.shape && moveShape({ y: 1 }, game.shape, game)
      return context
    })
    .catch(noError)

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

// TODO композиция
const renderGameFrame = (game: TetrisGame) => {
  !game.shape && createShape(game)
  stopShapeIfNeed(game)
  moveShapeDown(game).then(() => {
    incrementScore(checkLineFilled(game), game.settings)
    checkGameOver(game)
  })
  return game
}

// TODO композици
export const rotateShape = (direction: EMoveDirection, game: TetrisGame) => {
  new Intention(game)
    .predicate(() => {
      if (!game.shape) {
        return false
      }

      const backDirection = (rotationDirectionTransitions as any)[direction]
      rotateShapeBlocks(
        (rotationTransitions as any)[direction][game.shape.rotation],
        game.shape,
        game.grid
      )
      if (checkShapeMustStop(game) || isShapeStuckByWidth(0, game)) {
        rotateShapeBlocks(
          (rotationTransitions as any)[backDirection][game.shape.rotation],
          game.shape,
          game.grid
        )
        return false
      }

      rotateShapeBlocks(
        (rotationTransitions as any)[backDirection][game.shape.rotation],
        game.shape,
        game.grid
      )
      return true
    })
    .map((gameGrid: GameGrid) => {
      game.settings.direction = direction

      if (direction === EMoveDirection.up && game.shape) {
        rotateShapeBlocks(
          rotationTransitions[direction][game.shape.rotation],
          game.shape,
          game.grid
        )
      }

      return gameGrid
    })
}
