import { curry, uniqueId } from 'lodash'
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
      pipe(
        some(game),
        chain(ensureFieldIsNull('blasteroid')),
        map(createBlasteroid)
      ).do()
      startGame(game)
    },
    pause() {
      game.settings.isPaused = !game.settings.isPaused
      !game.settings.isPaused && startGame(game)
    },
    moveByX(step: number) {
      game.blasteroid &&
        pipe(
          some(game),
          chain(ensureShapeInBoundsByXAxis(game.blasteroid, step)),
          map(moveBlasteroidByX(step))
        ).do()
    },
    shoot() {
      console.log('shoot')
    },
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
  pipe(some(game), chain(ensureFieldIsNull('enemy')), map(createEnemy)).do()
  moveEnemyDown()
  console.log('render frame')
}

const createEnemy = (game: BlasteroidGame) => {
  console.log('create enemy')

  const enemyPrefix = 'enemy_'
  const group = 'enemy'
  game.enemy = {
    x: Math.round(game.grid.gameSize.width / 2) - 2,
    y: 0,
    direction: EMoveDirection.up,
    width: 3,
    height: 2,
    blocks: [
      { x: 1, y: 1, id: uniqueId(enemyPrefix), group },
      { x: 0, y: 0, id: uniqueId(enemyPrefix), group },
      { x: 1, y: 0, id: uniqueId(enemyPrefix), group },
      { x: 2, y: 0, id: uniqueId(enemyPrefix), group },
    ],
  }
  renderShapeToGrid(game.enemy, game.grid)
}

const ensureFieldIsNull = curry(
  (field: keyof BlasteroidGame, game: BlasteroidGame) => {
    return game[field] === null ? some(game) : none()
  }
)

const createBlasteroid = (game: BlasteroidGame) => {
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

const ensureShapeInBoundsByXAxis = curry(
  (shape: Shape, xDelta: number, game: BlasteroidGame) => {
    const nextX = shape.x + xDelta
    const shapeWidth = shape.width ?? 1

    return nextX >= 0 && nextX + shapeWidth <= game.grid.gameSize.width
      ? some(game)
      : none()
  }
)

const moveBlasteroidByX = curry((step: number, game: BlasteroidGame) => {
  game.blasteroid && (game.blasteroid.x += step)
  game.grid.blocks.forEach((block) => {
    if (block.group === 'blasteroid') {
      block.x += step
    }
  })
})

const renderShapeToGrid = (shape: Shape, grid: GameGrid) => {
  console.log('render shape', shape.blocks[0].group)

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
