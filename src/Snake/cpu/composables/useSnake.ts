import partial from 'lodash/partial'
import { GameGrid, GameSettings } from '~~/src/Common/cpu/providers/types/Game'
import { FType, State } from '~~/src/Common/cpu/utils/system'
import { Block } from '~~/src/Common/cpu/providers/types/Block'
import { EMoveDirection } from '~/src/Common/Types/GameTypes'
import { HMath } from '~/src/Common/Helpers/HMath'
import { isReverseDirection } from '~/src/Common/cpu/utils/game'

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
  moveTargetToRandomPlace(gameGrid.get())
  const nextFrame = () => {
    doTimer(gameSettings.get().speed, () => {
      moveForward(gameGrid.get(), snakeState)

      if (
        isSnakeOutOfBounds(gameGrid.get()) ||
        isSnakeAteItSelf(gameGrid.get())
      ) {
        gameSettings.get().isGameOver = true
        return
      }

      checkTargetEated(gameGrid.get(), gameSettings.get())

      if (!gameSettings.get().isGameOver && !gameSettings.get().isPaused) {
        nextFrame()
      }
    })
  }

  return {
    changeDirection: partial(changeDirection, snakeState),
    pause: partial(pause, gameSettings, nextFrame),
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
  if (isReverseDirection(snakeState.direction, newDirection)) {
    return
  }

  snakeState.direction = newDirection
}

const pause = (gameSettings: State<GameSettings>, nextFrame: () => void) => {
  gameSettings.set({
    ...gameSettings.get(),
    isPaused: !gameSettings.get().isPaused,
  })
  nextFrame()
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

const checkTargetEated = (gameGrid: GameGrid, gameSettings: GameSettings) => {
  const [target, lead] = gameGrid.blocks

  if (lead.x === target.x && lead.y === target.y) {
    moveTargetToRandomPlace(gameGrid)
    addBlockToTail(gameGrid)
    gameSettings.score++
    gameSettings.speed -= 10
  }
}

const addBlockToTail = (gameGrid: GameGrid) => {
  const [, lead] = gameGrid.blocks
  gameGrid.blocks.push({
    ...lead,
    id: 'tail' + gameGrid.blocks.length,
  })
}

const isSnakeOutOfBounds = (gameGrid: GameGrid) => {
  const [, lead] = gameGrid.blocks
  const lessThanX = lead.x < 0
  const lessThanY = lead.y < 0
  const moreThanX = lead.x > gameGrid.gameSize.width - 1
  const moreThanY = lead.y > gameGrid.gameSize.height - 1

  return lessThanX || lessThanY || moreThanX || moreThanY
}

const isSnakeAteItSelf = (gameGrid: GameGrid) => {
  let isAte = false
  const [, lead, ...tail] = gameGrid.blocks

  tail.forEach((point) => {
    if (point.x === lead.x && point.y === lead.y) {
      isAte = true
    }
  })

  return isAte
}

const moveTargetToRandomPlace = (gameGrid: GameGrid) => {
  const newX = HMath.random(0, gameGrid.gameSize.width - 1)
  const newY = HMath.random(0, gameGrid.gameSize.height - 1)

  if (gameGrid.blocks.some((block) => block.x === newX && block.y === newY)) {
    moveTargetToRandomPlace(gameGrid)
  } else {
    const [target] = gameGrid.blocks
    target.x = newX
    target.y = newY
  }
}
