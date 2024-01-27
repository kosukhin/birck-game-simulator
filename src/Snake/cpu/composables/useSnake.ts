import partial from 'lodash/partial'
import {
  GameGrid,
  GameSettings,
  GameSize,
} from '~~/src/Common/cpu/providers/types/Game'
import { FType, State } from '~~/src/Common/cpu/utils/system'
import { Block } from '~~/src/Common/cpu/providers/types/Block'
import { EMoveDirection } from '~/src/Common/Types/GameTypes'

interface SnakeState {
  direction: EMoveDirection
}

export const useSnake = (
  getGameSettings: FType<State<GameSettings>>,
  getGameGrid: FType<State<GameGrid>>,
  doTimer: FType<void, [number, () => void]>
) => {
  const gameSettings = getGameSettings()
  const gameGrid = getGameGrid()
  const snakeState: SnakeState = {
    direction: EMoveDirection.right,
  }

  const target: Block = { x: 5, y: 5, id: 'target' }
  const snake: Block[] = [
    { x: 4, y: 0, id: 'lead' },
    { x: 3, y: 0, id: 'tail1' },
    { x: 2, y: 0, id: 'tail2' },
    { x: 1, y: 0, id: 'tail3' },
    { x: 0, y: 0, id: 'tail4' },
  ]
  gameGrid.get().blocks.push(target)
  gameGrid.get().blocks.push(...snake)
  const nextFrame = () => {
    doTimer(gameSettings.get().speed, () => {
      moveForward(gameGrid.get(), snakeState)

      if (!gameSettings.get().isGameOver && !gameSettings.get().isPaused) {
        nextFrame()
      }
    })
  }

  return {
    changeDirection: partial(changeDirection, snakeState),
    pause: partial(pause, gameSettings),
    start: partial(start, gameSettings, nextFrame),
    destroy: partial(destroy, gameSettings),
  }
}

const moveForward = (gameGrid: GameGrid, snakeState: SnakeState) => {
  const [, loadPoint, ...tail] = gameGrid.blocks

  let prevPointPosition = [loadPoint.x, loadPoint.y]
  tail.forEach((point) => {
    const position = [point.x, point.y]
    point.x = prevPointPosition[0]
    point.y = prevPointPosition[1]
    prevPointPosition = position
  })

  snakeState.direction === EMoveDirection.down && (loadPoint.y += 1)
  snakeState.direction === EMoveDirection.up && (loadPoint.y -= 1)
  snakeState.direction === EMoveDirection.right && (loadPoint.x += 1)
  snakeState.direction === EMoveDirection.left && (loadPoint.x -= 1)
}

const changeDirection = (
  snakeState: SnakeState,
  newDirection: EMoveDirection
) => {
  snakeState.direction = newDirection
}

const pause = (gameSettings: State<GameSettings>) => {
  gameSettings.set({
    ...gameSettings.get(),
    isPaused: true,
  })
}

const start = (gameSettings: State<GameSettings>, nextFrame: () => void) => {
  gameSettings.set({
    ...gameSettings.get(),
    isPaused: false,
  })

  nextFrame()
}

const destroy = (gameSettings: State<GameSettings>) => {
  gameSettings.set({
    ...gameSettings.get(),
    isGameOver: true,
  })
}

const addBlockToTail = (snake: Block[]) => {
  snake.push({
    x: 0,
    y: 0,
    id: 'tail' + snake.length,
  })
}

const moveTargetToRandomPlace = (target: Block, gameSize: GameSize) => {
  target.x = 7
  target.y = 5
}
