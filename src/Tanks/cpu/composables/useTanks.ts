import { throttle, uniqueId } from 'lodash'
import { EMoveDirection } from './../../../Common/Types/GameTypes'
import {
  GameGrid,
  GameSettings,
} from './../../../Common/cpu/providers/types/Game'
import { Shape } from '~~/src/Common/cpu/providers/types/Block'
import { FType, State } from '~~/src/Common/cpu/utils/system'

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
      console.log('direction')
      rotateTank(newDirection, gameGrid.get())
    }, 50),
  }
}

const tanksMainCycle = (gameGrid: GameGrid) => {
  // console.log(gameGrid.blocks.length)
}

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

const rotateTank = (direction: EMoveDirection, gameGrid: GameGrid) => {
  const rotationRule = tankRotations[direction]

  gameGrid.blocks.forEach((block) => {
    if (block.group !== 'tank') return
    const position = rotationRule[block.localId as string]

    block.x = position.x
    block.y = position.y
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
