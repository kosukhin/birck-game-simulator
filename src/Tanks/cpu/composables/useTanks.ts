import { pick, throttle, uniqueId } from 'lodash'
import { EMoveDirection } from './../../../Common/Types/GameTypes'
import {
  GameGrid,
  GameSettings,
  GameGrid,
  GameGrid,
} from './../../../Common/cpu/providers/types/Game'
import { Intention } from '~~/src/Common/Library/Intention'
import { Block, Shape } from '~~/src/Common/cpu/providers/types/Block'
import { FType, State } from '~~/src/Common/cpu/utils/system'
import { HMath } from '~~/src/Common/Helpers/HMath'

export const useTanks = (
  getGameSettings: FType<State<GameSettings>>,
  getGameGrid: FType<State<GameGrid>>,
  doTimer: FType<void, [number, () => void]>
) => {
  const gameSettings = getGameSettings()
  const gameGrid = getGameGrid()

  gameGrid.get().blocks.push(...tank.blocks)
  rotateTank(EMoveDirection.right, gameGrid.get(), tank)

  const nextFrame = () => {
    doTimer(gameSettings.get().speed, () => {
      gameSettings.get().frameCounter += 1
      tanksMainCycle(gameGrid.get())
      !gameSettings.get().isGameOver &&
        !gameSettings.get().isPaused &&
        nextFrame()
    })
  }

  return {
    start: nextFrame,
    shoot: throttle(() => {
      shoot(tank, gameGrid.get())
    }, 100),
    pause() {
      gameSettings.get().isPaused = !gameSettings.get().isPaused
      gameSettings.get().isPaused && nextFrame()
    },
    direction: throttle((newDirection: EMoveDirection) => {
      rotateTank(newDirection, gameGrid.get(), tank)
      tank.direction === newDirection &&
        moveTank(tank, newDirection, gameGrid.get())
      tank.direction = newDirection
    }, 50),
  }
}

const tanksMainCycle = (gameGrid: GameGrid) => {
  // console.log(gameGrid.blocks.length)
  if (!bots.size) {
    bots.add(createBot(gameGrid))
  }
}

const bots: Set<Shape> = new Set()
const tank: Shape = {
  x: 0,
  y: 0,
  direction: EMoveDirection.right,
  blocks: [
    { x: 0, y: 0, id: uniqueId('tank_'), group: 'tank', localId: '0' },
    { x: 0, y: 0, id: uniqueId('tank_'), group: 'tank', localId: '1' },
    { x: 0, y: 0, id: uniqueId('tank_'), group: 'tank', localId: '2' },
    { x: 0, y: 0, id: uniqueId('tank_'), group: 'tank', localId: '3' },
    { x: 0, y: 0, id: uniqueId('tank_'), group: 'tank', localId: '4' },
    { x: 0, y: 0, id: uniqueId('tank_'), group: 'tank', localId: '5' },
    { x: 0, y: 0, id: uniqueId('tank_'), group: 'tank', localId: '6' },
  ],
}

const createBot = (gameGrid: GameGrid): Shape => {
  const group = 'bot'
  const bot = {
    x: gameGrid.gameSize.width - TANK_SIZE,
    y: gameGrid.gameSize.height - TANK_SIZE,
    direction: EMoveDirection.right,
    blocks: [
      { x: 0, y: 0, id: uniqueId('bot_'), group, localId: '0' },
      { x: 0, y: 0, id: uniqueId('bot_'), group, localId: '1' },
      { x: 0, y: 0, id: uniqueId('bot_'), group, localId: '2' },
      { x: 0, y: 0, id: uniqueId('bot_'), group, localId: '3' },
      { x: 0, y: 0, id: uniqueId('bot_'), group, localId: '4' },
      { x: 0, y: 0, id: uniqueId('bot_'), group, localId: '5' },
      { x: 0, y: 0, id: uniqueId('bot_'), group, localId: '6' },
    ],
  }
  bots.add(bot)
  gameGrid.blocks.push(...bot.blocks)
  rotateTank(EMoveDirection.up, gameGrid, bot)

  const nextBotFrame = () => {
    const tankMidX = midX(tank, TANK_SIZE)
    const tankMidY = midY(tank, TANK_SIZE)
    const botMidX = midX(bot, TANK_SIZE)
    const botMidY = midY(bot, TANK_SIZE)
    console.log('bot logic')
    const isSameX = tank.x <= botMidX && botMidX <= maxX(tank, TANK_SIZE)
    const isSameY = tank.y <= botMidY && botMidY <= maxY(tank, TANK_SIZE)

    if (isSameX || isSameY) {
      let shootDirection = EMoveDirection.up

      if (isSameX && botMidX <= tankMidX) {
        shootDirection = EMoveDirection.down
      }

      if (isSameX && botMidX >= tankMidX) {
        shootDirection = EMoveDirection.up
      }

      if (isSameY && botMidY >= tankMidY) {
        shootDirection = EMoveDirection.left
      }

      if (isSameY && botMidY <= tankMidY) {
        shootDirection = EMoveDirection.right
      }

      bot.direction = shootDirection
      rotateTank(bot.direction, gameGrid, bot)
      shoot(bot, gameGrid)
    } else {
      const xDistance = tankMidX - botMidX + HMath.random(0, 4)
      const yDistance = tankMidY - botMidY + HMath.random(0, 4)

      if (Math.abs(yDistance) < Math.abs(xDistance)) {
        bot.direction = yDistance < 0 ? EMoveDirection.down : EMoveDirection.up
      } else {
        bot.direction =
          xDistance < 0 ? EMoveDirection.right : EMoveDirection.left
      }
      moveTank(bot, bot.direction, gameGrid)
    }

    if (bots.has(bot)) {
      setTimeout(() => {
        nextBotFrame()
      }, 200)
    }
  }
  nextBotFrame()

  return bot
}

const getShapeBlocks = (shape: Shape, gameGrid: GameGrid) => {
  const shapeIds = shape.blocks.map((b) => b.id)
  return gameGrid.blocks.filter((b) => shapeIds.includes(b.id))
}

const rotateTank = (
  direction: EMoveDirection,
  gameGrid: GameGrid,
  shape: Shape
) => {
  const rotationRule = tankRotations[direction]

  gameGrid.blocks.forEach((block) => {
    if (!isBlockInShape(block, shape)) return
    const position = rotationRule[block.localId as string]

    block.x = position.x + shape.x
    block.y = position.y + shape.y
  })
}

const isBlockInShape = (block: Block, shape: Shape) => {
  return shape.blocks.findIndex((currBlock) => currBlock.id === block.id) > -1
}

const TANK_SIZE = 3

const isStuckToBounds = (
  direction: EMoveDirection,
  point: { x: number; y: number },
  gameGrid: GameGrid,
  size: number
) => {
  const isStuckToTop = direction === EMoveDirection.up && point.y <= 0
  const isStuckToLeft = direction === EMoveDirection.left && point.x <= 0
  const isStuckToRight =
    direction === EMoveDirection.right &&
    point.x >= gameGrid.gameSize.width - size
  const isStuckToBottom =
    direction === EMoveDirection.down &&
    point.y >= gameGrid.gameSize.height - size

  return isStuckToTop || isStuckToLeft || isStuckToRight || isStuckToBottom
}

const moveTank = (
  shape: Shape,
  direction: EMoveDirection,
  gameGrid: GameGrid
) => {
  new Intention(gameGrid)
    .predicate(() => {
      return !isStuckToBounds(direction, shape, gameGrid, TANK_SIZE)
    })
    .map((gameGrid: GameGrid) => {
      const prevTankPoint = pick(shape, ['x', 'y'])
      direction === EMoveDirection.up && (shape.y -= 1)
      direction === EMoveDirection.right && (shape.x += 1)
      direction === EMoveDirection.down && (shape.y += 1)
      direction === EMoveDirection.left && (shape.x -= 1)

      const shapeIds = shape.blocks.map((b) => b.id)
      const shapeBlocks = gameGrid.blocks.filter((b) => shapeIds.includes(b.id))
      shapeBlocks.forEach((block) => {
        block.x += shape.x - prevTankPoint.x
        block.y += shape.y - prevTankPoint.y
      })

      return gameGrid
    })
}

const tankRotations: Record<string, any> = {
  [EMoveDirection.right]: {
    '0': { x: 0, y: 0 },
    '1': { x: 1, y: 0 },
    '2': { x: 0, y: 1 },
    '3': { x: 1, y: 1 },
    '4': { x: 2, y: 1 },
    '5': { x: 0, y: 2 },
    '6': { x: 1, y: 2 },
  },
  [EMoveDirection.down]: {
    '0': { x: 0, y: 0 },
    '1': { x: 1, y: 0 },
    '2': { x: 2, y: 0 },
    '3': { x: 0, y: 1 },
    '4': { x: 1, y: 1 },
    '5': { x: 2, y: 1 },
    '6': { x: 1, y: 2 },
  },
  [EMoveDirection.left]: {
    '0': { x: 0, y: 1 },
    '1': { x: 1, y: 0 },
    '2': { x: 1, y: 1 },
    '3': { x: 1, y: 2 },
    '4': { x: 2, y: 0 },
    '5': { x: 2, y: 1 },
    '6': { x: 2, y: 2 },
  },
  [EMoveDirection.up]: {
    '0': { x: 1, y: 0 },
    '1': { x: 0, y: 1 },
    '2': { x: 1, y: 1 },
    '3': { x: 2, y: 1 },
    '4': { x: 0, y: 2 },
    '5': { x: 1, y: 2 },
    '6': { x: 2, y: 2 },
  },
}

const shiftByDirection = (direction: EMoveDirection) => {
  const shiftPoint = { x: 0, y: 0 }
  direction === EMoveDirection.up && (shiftPoint.y -= 1)
  direction === EMoveDirection.right && (shiftPoint.x += 1)
  direction === EMoveDirection.down && (shiftPoint.y += 1)
  direction === EMoveDirection.left && (shiftPoint.x -= 1)

  return shiftPoint
}

const SHOOT_SPEED = 50

const isTopOrLeft = (direction: EMoveDirection) => {
  return direction === EMoveDirection.up || direction === EMoveDirection.left
}

const shoot = (fromShape: Shape, gameGrid: GameGrid) => {
  const savedDirection = fromShape.direction
  const shiftPoint = shiftByDirection(savedDirection)
  const shootBlock: Block = {
    x: fromShape.x + shiftPoint.y * (isTopOrLeft(fromShape.direction) ? -1 : 1),
    y: fromShape.y + shiftPoint.x * (isTopOrLeft(fromShape.direction) ? -1 : 1),
    id: uniqueId('shoot_'),
    group: 'shoot',
  }
  gameGrid.blocks.push(shootBlock)
  const shootInGrid = gameGrid.blocks.at(-1)
  const nextShootFrame = () => {
    setTimeout(() => {
      const shiftPoint = shiftByDirection(savedDirection)
      shootInGrid && (shootInGrid.x += shiftPoint.x)
      shootInGrid && (shootInGrid.y += shiftPoint.y)
      if (
        shootInGrid &&
        !isStuckToBounds(savedDirection, shootInGrid, gameGrid, 1)
      ) {
        nextShootFrame()
      } else {
        const blockIndex = gameGrid.blocks.findIndex(
          (block) => block.id === shootBlock.id
        )
        gameGrid.blocks.splice(blockIndex, 1)
      }
    }, SHOOT_SPEED)
  }
  nextShootFrame()
}

const oppositeDirections = {
  [EMoveDirection.up]: EMoveDirection.down,
  [EMoveDirection.right]: EMoveDirection.left,
  [EMoveDirection.down]: EMoveDirection.up,
  [EMoveDirection.left]: EMoveDirection.right,
}

const midX = (tank: Shape, size: number): number => {
  return tank.x + HMath.roundMin((size - 1) / 2)
}

const midY = (tank: Shape, size: number): number => {
  return tank.y + HMath.roundMin((size - 1) / 2)
}

const maxX = (tank: Shape, size: number): number => {
  return tank.x + size - 1
}

const maxY = (tank: Shape, size: number): number => {
  return tank.y + size - 1
}
