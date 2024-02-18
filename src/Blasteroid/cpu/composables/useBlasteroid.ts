import { uniqueId } from 'lodash'
import {
  LazyMonad,
  map,
  chain,
  none,
  pipe,
  some,
} from './../../../Common/Library/adt'
import { EMoveDirection } from '~~/src/Common/Types/GameTypes'
import { Shape } from '~~/src/Common/cpu/providers/types/Block'
import {
  Game,
  GameGrid,
  GameSettings,
} from '~~/src/Common/cpu/providers/types/Game'
import { FType, State } from '~~/src/Common/cpu/utils/system'

type BlasteroidGame = Game & {
  blasteroid: Shape | null
  enemy: Shape | null
}

export const useBlasteroid = (
  getGameSettings: FType<State<GameSettings>>,
  getGameGrid: FType<State<GameGrid>>
) => {
  const game: BlasteroidGame = {
    grid: getGameGrid().get(),
    settings: getGameSettings().get(),
    blasteroid: null,
    enemy: null,
  }

  return {
    start() {
      startGame(game)
    },
    pause() {
      game.settings.isPaused = !game.settings.isPaused
      !game.settings.isPaused && startGame(game)
    },
    moveByX(step: number) {
      moveBlasteroidByX(step, game)
    },
    shoot() {},
  }
}

const startGame = (game: Game) =>
  pipe(
    some(game),
    chain(ensureNotGameOver),
    chain(ensureNotPaused),
    map(renderGameFrame),
    repeat(game.settings.speed)
  ).do()

const renderGameFrame = (game: BlasteroidGame) => {
  createBlasteroidIfNeed(game)
  createEnemyIfNeed()
  moveEnemyDown()
  console.log('render frame')
}

const createEnemyIfNeed = () => {
  console.log('create enemy')
}

const createBlasteroidIfNeed = (game: BlasteroidGame) => {
  if (!game.blasteroid) {
    game.blasteroid = {
      x: 0,
      y: game.grid.gameSize.height - 2,
      direction: EMoveDirection.up,
      blocks: [
        { x: 1, y: 0, id: uniqueId('blas_'), group: 'blasteroid' },
        { x: 0, y: 1, id: uniqueId('blas_'), group: 'blasteroid' },
        { x: 1, y: 1, id: uniqueId('blas_'), group: 'blasteroid' },
        { x: 2, y: 1, id: uniqueId('blas_'), group: 'blasteroid' },
      ],
    }

    renderShapeToGrid(game.blasteroid, game.grid)
  }
}

const ensureShapeInBounds = () => {}

const moveBlasteroidByX = (step: number, game: BlasteroidGame) => {
  game.grid.blocks.forEach((block) => {
    if (block.group === 'blasteroid') {
      block.x += step
    }
  })
}

const renderShapeToGrid = (shape: Shape, grid: GameGrid) => {
  shape.blocks.forEach((block) => {
    block.x += shape.x
    block.y += shape.y
  })
  grid.blocks.push(...shape.blocks)
}

const moveEnemyDown = () => {}

const repeat = (milliseconds: number) => (context: LazyMonad) => {
  context.lazyMap((v) => {
    setTimeout(() => {
      context.do()
    }, milliseconds)
    return v
  })
  return context
}

const ensureNotGameOver = (v: Game) => {
  return v.settings.isGameOver ? none() : some(v)
}

const ensureNotPaused = (v: Game) => {
  return v.settings.isPaused ? none() : some(v)
}

const debug = (v) => {
  console.log('debug:', v)
  return v
}
