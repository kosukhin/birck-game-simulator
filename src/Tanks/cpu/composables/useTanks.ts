import { pick, throttle, uniqueId } from 'lodash'
import { EMoveDirection } from './../../../Common/Types/GameTypes'
import {
  GameGrid,
  GameSettings,
} from './../../../Common/cpu/providers/types/Game'
import { Shape } from '~~/src/Common/cpu/providers/types/Block'
import { FType, State } from '~~/src/Common/cpu/utils/system'
import { Intention } from '~~/src/Common/Library/Intention'

export const useTanks = (
  getGameSettings: FType<State<GameSettings>>,
  getGameGrid: FType<State<GameGrid>>,
  doTimer: FType<void, [number, () => void]>
) => {
  const gameSettings = getGameSettings()
  const gameGrid = getGameGrid()

  gameGrid.get().blocks.push(...tank.blocks)
  rotateTank(EMoveDirection.right, gameGrid.get())

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
    pause() {
      gameSettings.get().isPaused = !gameSettings.get().isPaused
      gameSettings.get().isPaused && nextFrame()
    },
    moveByX(x: number) {
      console.log(x, gameGrid.get())
    },
    moveDown() {
      console.log(gameGrid.get())
    },
    direction: throttle((newDirection: EMoveDirection) => {
      rotateTank(newDirection, gameGrid.get())
      moveTank(newDirection, gameGrid.get())
    }, 50),
  }
}

const tanksMainCycle = (gameGrid: GameGrid) => {
  // console.log(gameGrid.blocks.length)
}

const bots: Shape[] = []
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

const createBot = (botId: number): Shape => {
  const group = 'bot' + botId
  return {
    x: 0,
    y: 0,
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
}

const rotateTank = (direction: EMoveDirection, gameGrid: GameGrid) => {
  const rotationRule = tankRotations[direction]

  gameGrid.blocks.forEach((block) => {
    if (block.group !== 'tank') return
    const position = rotationRule[block.localId as string]

    block.x = position.x + tank.x
    block.y = position.y + tank.y
  })
}

const TANK_SIZE = 3

const moveTank = (direction: EMoveDirection, gameGrid: GameGrid) => {
  new Intention(gameGrid)
    .predicate(() => {
      const isStuckToTop = direction === EMoveDirection.up && tank.y <= 0
      const isStuckToLeft = direction === EMoveDirection.left && tank.x <= 0
      const isStuckToRight =
        direction === EMoveDirection.right &&
        tank.x >= gameGrid.gameSize.width - TANK_SIZE
      const isStuckToBottom =
        direction === EMoveDirection.down &&
        tank.y >= gameGrid.gameSize.height - TANK_SIZE

      return !(
        isStuckToTop ||
        isStuckToLeft ||
        isStuckToRight ||
        isStuckToBottom
      )
    })
    .map((gameGrid: GameGrid) => {
      const prevTankPoint = pick(tank, ['x', 'y'])
      direction === EMoveDirection.up && (tank.y -= 1)
      direction === EMoveDirection.right && (tank.x += 1)
      direction === EMoveDirection.down && (tank.y += 1)
      direction === EMoveDirection.left && (tank.x -= 1)

      const shapeIds = tank.blocks.map((b) => b.id)
      const shapeBlocks = gameGrid.blocks.filter((b) => shapeIds.includes(b.id))
      shapeBlocks.forEach((block) => {
        block.x += tank.x - prevTankPoint.x
        block.y += tank.y - prevTankPoint.y
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
