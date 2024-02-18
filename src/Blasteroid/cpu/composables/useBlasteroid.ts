import { curry, throttle, uniqueId } from 'lodash'
import {
  LazyMonad,
  map,
  tap,
  chain,
  none,
  pipe,
  some,
} from './../../../Common/Library/adt'
import { EMoveDirection } from '~~/src/Common/Types/GameTypes'
import { Block, Shape } from '~~/src/Common/cpu/providers/types/Block'
import {
  Game,
  GameGrid,
  GameSettings,
} from '~~/src/Common/cpu/providers/types/Game'
import { FType, State } from '~~/src/Common/cpu/utils/system'
import { HMath } from '~~/src/Common/Helpers/HMath'

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

  const onShoot = throttle(() => {
    if (!game.blasteroid) {
      return
    }
    const shoot = createShoot(game.blasteroid, 0, game)
    const shoot2 = createShoot(game.blasteroid, 2, game)

    ;[shoot, shoot2].forEach((currentShoot) => {
      pipe(
        some(game),
        chain(ensureNotGameOver),
        chain(ensureNotPaused),
        chain(ensureShapeInBoundsByYAxis(currentShoot)),
        map(moveShapeToDirection(currentShoot)),
        map(checkEnemyShooted(currentShoot)),
        tap(removeShootIfStopped(currentShoot, game)),
        repeat(50)
      ).do()
    })
  }, 100)

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
          chain(ensureNotGameOver),
          chain(ensureNotPaused),
          chain(ensureShapeInBoundsByXAxis(game.blasteroid, step)),
          map(moveBlasteroidByX(step))
        ).do()
    },
    shoot() {
      onShoot()
    },
  }
}

const startGame = (game: Game) =>
  pipe(
    some(game),
    chain(ensureNotGameOver),
    chain(ensureNotPaused),
    map(renderGameFrame),
    repeat(() => game.settings.speed)
  ).do()

const renderGameFrame = (game: BlasteroidGame) => {
  game.settings.frameCounter += 1
  pipe(some(game), chain(ensureFieldIsNull('enemy')), map(createEnemy)).do()
  game.enemy &&
    pipe(
      some(game),
      chain(ensureShapeInBoundsByYAxis(game.enemy)),
      map(moveShapeToDirection(game.enemy)),
      tap(checkGameOver(game))
    ).do()
}

const checkGameOver = curry((game: BlasteroidGame, context: unknown) => {
  context === null && (game.settings.isGameOver = true)
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
  (shoot: Shape, game: BlasteroidGame, context: unknown | null) => {
    if (context === null) {
      game.grid.blocks = game.grid.blocks.filter(
        (block) => block.id !== shoot.blocks[0]?.id
      )
    }
  }
)

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

const ensureShapeInBoundsByYAxis = curry(
  (shape: Shape, game: BlasteroidGame) => {
    const step = calculateShapeStepToDirection(shape)
    const nextY = shape.y + step.yDelta
    const shapeHeight = shape.height ?? 1

    return nextY >= 0 && nextY + shapeHeight <= game.grid.gameSize.height
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
  shape.blocks.forEach((block) => {
    block.x += shape.x
    block.y += shape.y
  })
  grid.blocks.push(...shape.blocks)
}

const repeat = (milliseconds: Function | number) => (context: LazyMonad) => {
  context.lazyMap((v) => {
    let ms = milliseconds
    if (typeof milliseconds === 'function') {
      ms = milliseconds()
    }
    setTimeout(() => {
      context.do()
    }, ms as number)
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

const moveShapeToDirection = curry((shape: Shape, game: BlasteroidGame) => {
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
})
