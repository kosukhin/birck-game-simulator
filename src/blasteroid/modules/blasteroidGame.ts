import { partial, curry, throttle, uniqueId } from 'lodash'
import { skipNextThens, resolve, reject, noError } from '~~/src/common/utils/fp'
import { EMoveDirection } from '~~/src/common/types/GameTypes'
import { Block, Shape } from '~~/src/common/types/Block'
import { Game, GameGrid, GameSettings } from '~~/src/common/types/Game'
import { FType, State } from '~~/src/common/utils/system'
import { HMath } from '~~/src/common/utils/HMath'

type BlasteroidGame = Game & {
  blasteroid: Shape | null
  enemy: Shape | null
}

const animateShoot: any = (game: BlasteroidGame, shoot: Shape) => {
  return resolve(game)
    .then(ensureNotGameOver)
    .then(ensureNotPaused)
    .then(ensureShapeInBoundsByYAxis(shoot))
    .catch(skipNextThens)
    .then(moveShapeToDirection(shoot))
    .then(checkEnemyShooted(shoot))
    .then(repeat(() => animateShoot(game, shoot), 50))
    .catch(removeShootIfStopped(shoot, game))
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

  const animateGameShoot = partial(animateShoot, game)
  const onShoot = throttle(() => {
    game.blasteroid &&
      [
        createShoot(game.blasteroid, 0, game),
        createShoot(game.blasteroid, 2, game),
      ].forEach(animateGameShoot)
  }, 100)

  return {
    start() {
      resolve(game)
        .then(ensureFieldIsNull('blasteroid'))
        .catch(skipNextThens)
        .then(createBlasteroid)
        .catch(noError)
      startGame(game)
    },
    pause() {
      game.settings.isPaused = !game.settings.isPaused
      !game.settings.isPaused && startGame(game)
    },
    moveByX(step: number) {
      game.blasteroid &&
        resolve(game)
          .then(ensureNotGameOver)
          .then(ensureNotPaused)
          .then(ensureShapeInBoundsByXAxis(game.blasteroid, step))
          .catch(skipNextThens)
          .then(moveBlasteroidByX(step))
          .catch(noError)
    },
    shoot() {
      onShoot()
    },
  }
}

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

const checkGameOver = curry((game: BlasteroidGame, context: unknown) => {
  context instanceof Error && (game.settings.isGameOver = true)
})

const createEnemy = (game: BlasteroidGame) => {
  const enemyPrefix = 'enemy_'
  const group = 'enemy'
  const enemyShapeIndex = HMath.random(0, enemies.length - 1)
  game.enemy = {
    x: HMath.random(0, game.grid.gameSize.width - 5),
    y: -1,
    height: 3,
    direction: EMoveDirection.down,
    blocks: enemies[enemyShapeIndex].map((blockShape) => ({
      ...blockShape,
      id: uniqueId(enemyPrefix),
      group,
    })),
  }
  renderShapeToGrid(game.enemy, game.grid)
  game.enemy.height = calculateShapeHeight(game.enemy, game)
}

const calculateShapeHeight = (shape: Shape, game: BlasteroidGame) => {
  const shapeBlock = shape.blocks[0]
  const shapeBlocks = game.grid.blocks.filter(
    (block) => block.group === shapeBlock.group
  )
  return Math.max(...shapeBlocks.map((block) => block.y - shape.y)) + 1
}

const enemies = [
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 4, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
    { x: 3, y: 2 },
    { x: 4, y: 2 },
  ],
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 2, y: 2 },
  ],
  [
    { x: 2, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
    { x: 3, y: 2 },
    { x: 4, y: 2 },
    { x: 1, y: 3 },
    { x: 2, y: 3 },
    { x: 3, y: 3 },
    { x: 2, y: 4 },
  ],
  [
    { x: 1, y: 0 },
    { x: 3, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 4, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
    { x: 3, y: 2 },
    { x: 4, y: 2 },
    { x: 1, y: 3 },
    { x: 2, y: 3 },
    { x: 3, y: 3 },
    { x: 2, y: 4 },
  ],
  [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 4, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
    { x: 3, y: 2 },
    { x: 4, y: 2 },
    { x: 1, y: 3 },
    { x: 2, y: 3 },
    { x: 3, y: 3 },
    { x: 0, y: 4 },
    { x: 2, y: 4 },
    { x: 4, y: 4 },
  ],
]

const createShoot = (
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

const checkEnemyShooted = curry((shoot: Shape, game: BlasteroidGame) => {
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

const removeShootIfStopped = curry(
  (shoot: Shape, game: BlasteroidGame, context: any) => {
    game.grid.blocks = game.grid.blocks.filter(
      (block) => block.id !== shoot.blocks[0]?.id
    )
    return context
  }
)

const ensureFieldIsNull = curry(
  (field: keyof BlasteroidGame, game: BlasteroidGame) => {
    return game[field] === null ? resolve(game) : reject('field is not null')
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
  (shape: Shape, xDelta: number, game: Game) => {
    const nextX = shape.x + xDelta
    const shapeWidth = shape.width ?? 1

    return nextX >= 0 && nextX + shapeWidth <= game.grid.gameSize.width
      ? resolve(game)
      : reject('out of  bounds by x')
  }
)

const ensureShapeInBoundsByYAxis = curry(
  (shape: Shape, game: Game): Promise<Game> => {
    const step = calculateShapeStepToDirection(shape)
    const nextY = shape.y + step.yDelta
    const shapeHeight = shape.height ?? 1

    return nextY >= 0 && nextY + shapeHeight <= game.grid.gameSize.height
      ? resolve(game)
      : reject('out of y bounds')
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
  shape.blocks.forEach((block) => {
    block.x += shape.x
    block.y += shape.y
  })
  grid.blocks.push(...shape.blocks)
}

const repeat = curry(
  (fn: Function, milliseconds: Function | number, context: any) => {
    let ms = milliseconds
    if (typeof milliseconds === 'function') {
      ms = milliseconds()
    }
    setTimeout(() => {
      fn()
    }, ms as number)
    return context
  },
  3
)

const ensureNotGameOver = (v: Game) =>
  v.settings.isGameOver ? reject('gameover') : resolve(v)

const ensureNotPaused = (v: Game) =>
  v.settings.isPaused ? reject('paused') : resolve(v)

const calculateShapeStepToDirection = (shape: Shape) => {
  const xDelta =
    (shape.direction === EMoveDirection.left && -1) ||
    (shape.direction === EMoveDirection.right && 1) ||
    0
  const yDelta =
    (shape.direction === EMoveDirection.up && -1) ||
    (shape.direction === EMoveDirection.down && 1) ||
    0

  return {
    xDelta,
    yDelta,
  }
}

const moveShapeToDirection = curry(
  (shape: Shape, game: BlasteroidGame): BlasteroidGame => {
    const step = calculateShapeStepToDirection(shape)
    shape.x += step.xDelta
    shape.y += step.yDelta
    game.grid.blocks.forEach((block) => {
      if (shape.blocks.some((shapeBlock) => shapeBlock.id === block.id)) {
        block.x += step.xDelta
        block.y += step.yDelta
      }
    })

    return game
  }
)
