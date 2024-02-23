import { random, uniqueId } from 'lodash'
import { FType, State } from '~~/src/common/utils/system'
import { GameGrid, GameSettings } from '~~/src/common/types/Game'
import { Block } from '~~/src/common/types/Block'
import { EMoveDirection } from '~~/src/common/types/GameTypes'
import { Intention } from '~/src/common/library/Intention'

type Rotation = '0' | '1' | '2' | '3'

type Shape = {
  rotation: Rotation
  x: number
  y: number
  blocks: Block[]
}

let shape: Shape | null = null

const snakeMainCycle = (gameGrid: GameGrid, gameSettings: GameSettings) => {
  !shape && createShape(gameGrid)
  stopShapeIfNeed(gameGrid)
  moveShapeDown(gameGrid)
  incrementScore(checkLineFilled(gameGrid), gameSettings)
  checkGameOver(gameGrid, gameSettings)
}

const fallStaticBlocks = (gameGrid: GameGrid) => {
  const staticBlocks = gameGrid.blocks
  let hasBlocksToFall = false
  const blocksGrid = staticBlocks.reduce((acc: any, item) => {
    acc['' + item.y + item.x] = 1
    return acc
  }, {})
  staticBlocks.forEach((block) => {
    const nextY = block.y + 1
    const notLast = nextY < gameGrid.gameSize.height
    const noBottomBlock = !blocksGrid['' + nextY + block.x]
    if (notLast && noBottomBlock) {
      block.y += 1
      hasBlocksToFall = true
    }
  })
  if (hasBlocksToFall) {
    fallStaticBlocks(gameGrid)
  }
}

const checkGameOver = (gameGrid: GameGrid, gameSettings: GameSettings) => {
  gameSettings.isGameOver = gameGrid.blocks.some((block) => {
    return block.y < 0
  })
}

const createShape = (gameGrid: GameGrid) => {
  shape = createRandomShape()
  gameGrid.blocks.push(...shape.blocks)
}

const checkShapeMustStop = (gameGrid: GameGrid) => {
  return !shape || isShapeStuckToEnd(gameGrid) || isShapeStuckToBlock(gameGrid)
}

const stopShapeIfNeed = (gameGrid: GameGrid) => {
  checkShapeMustStop(gameGrid) && (shape = null)
}

const isShapeStuckToEnd = (gameGrid: GameGrid) => {
  return (
    shape &&
    shape.blocks.some((block) => {
      const nextY = block.y + 1
      return nextY >= gameGrid.gameSize.height
    })
  )
}

const isShapeStuckToBlock = (gameGrid: GameGrid) => {
  if (!shape) {
    return false
  }

  const shapeIds = shape.blocks.map((b) => b.id)
  const shapeBlocks = gameGrid.blocks.filter((b) => shapeIds.includes(b.id))
  const staticBlocks = gameGrid.blocks.filter((b) => !shapeIds.includes(b.id))
  return staticBlocks.some((block) =>
    shapeBlocks.some(
      (shapeBlock) => shapeBlock.x === block.x && shapeBlock.y + 1 === block.y
    )
  )
}

const isShapeStuckByWidth = (x: number, gameGrid: GameGrid) => {
  return (
    shape &&
    shape.blocks.some((block) => {
      const nextX = block.x + x
      return nextX < 0 || nextX >= gameGrid.gameSize.width
    })
  )
}

const isShapeStuckToBlockByX = (gameGrid: GameGrid) => {
  if (!shape) {
    return false
  }

  const shapeIds = shape.blocks.map((b) => b.id)
  const shapeBlocks = gameGrid.blocks.filter((b) => shapeIds.includes(b.id))
  const staticBlocks = gameGrid.blocks.filter((b) => !shapeIds.includes(b.id))
  return staticBlocks.some((block) =>
    shapeBlocks.some(
      (shapeBlock) =>
        (shapeBlock.x + 1 === block.x || shapeBlock.x - 1 === block.x) &&
        shapeBlock.y === block.y
    )
  )
}

const checkLineFilled = (gameGrid: GameGrid): number => {
  const filled = removeFilledLines(gameGrid)
  if (filled) {
    shape = null
    fallStaticBlocks(gameGrid)
  }
  return filled
}

const incrementScore = (filledLines: number, gameSettings: GameSettings) => {
  gameSettings.score += filledLines
  gameSettings.speed -= filledLines * 10
}

const moveShapeByX = (x: number, gameGrid: GameGrid) => {
  new Intention(gameGrid)
    .predicate(() => {
      if (!shape) {
        return false
      }

      return (
        !isShapeStuckByWidth(x, gameGrid) && !isShapeStuckToBlockByX(gameGrid)
      )
    })
    .map((gameGrid: GameGrid) => {
      moveShape({ x }, shape as Shape, gameGrid)
      return gameGrid
    })
}

const moveShapeDown = (gameGrid: GameGrid) => {
  new Intention(gameGrid)
    .predicate(() => {
      return !checkShapeMustStop(gameGrid)
    })
    .map((gameGrid: GameGrid) => {
      moveShape({ y: 1 }, shape as Shape, gameGrid)
      return gameGrid
    })
}

const rotateShape = (
  direction: EMoveDirection,
  gameSettings: GameSettings,
  gameGrid: GameGrid
) => {
  new Intention(gameGrid)
    .predicate(() => {
      if (!shape) {
        return false
      }

      const backDirection = (rotationDirectionTransitions as any)[direction]
      rotateShapeBlocks(
        (rotationTransitions as any)[direction][shape.rotation],
        shape as Shape,
        gameGrid
      )
      if (checkShapeMustStop(gameGrid) || isShapeStuckByWidth(0, gameGrid)) {
        rotateShapeBlocks(
          (rotationTransitions as any)[backDirection][shape.rotation],
          shape as Shape,
          gameGrid
        )
        return false
      }

      rotateShapeBlocks(
        (rotationTransitions as any)[backDirection][shape.rotation],
        shape as Shape,
        gameGrid
      )
      return true
    })
    .map((gameGrid: GameGrid) => {
      gameSettings.direction = direction

      if (direction === EMoveDirection.up) {
        rotateShapeBlocks(
          rotationTransitions[direction][(shape as Shape).rotation],
          shape as Shape,
          gameGrid
        )
      }

      return gameGrid
    })
}

export const useTetris = (
  getGameSettings: FType<State<GameSettings>>,
  getGameGrid: FType<State<GameGrid>>,
  doTimer: FType<void, [number, () => void]>
) => {
  const gameSettings = getGameSettings()
  const gameGrid = getGameGrid()

  const nextFrame = () => {
    doTimer(gameSettings.get().speed, () => {
      gameSettings.get().frameCounter += 1
      snakeMainCycle(gameGrid.get(), gameSettings.get())
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
      moveShapeByX(x, gameGrid.get())
    },
    moveDown() {
      moveShapeDown(gameGrid.get())
    },
    direction(newDirection: EMoveDirection) {
      rotateShape(newDirection, gameSettings.get(), gameGrid.get())
    },
  }
}

const removeFilledLines = (gameGrid: GameGrid) => {
  const lines: Record<string, any> = {}
  gameGrid.blocks.forEach((block, index) => {
    if (!lines[block.y]) {
      lines[block.y] = []
    }
    lines[block.y].push(index)
  })

  gameGrid.blocks = gameGrid.blocks.filter((block) => {
    return !lines[block.y] || lines[block.y].length < gameGrid.gameSize.width
  })

  return Object.values(lines).filter(
    (blocks: number[]) => blocks.length >= gameGrid.gameSize.width
  ).length
}

const rotationDirectionTransitions: Record<
  EMoveDirection.up | EMoveDirection.down,
  EMoveDirection.up | EMoveDirection.down
> = {
  [EMoveDirection.up]: EMoveDirection.down,
  [EMoveDirection.down]: EMoveDirection.up,
}

const rotationTransitions: Record<
  EMoveDirection.up | EMoveDirection.down,
  Record<Rotation, Rotation>
> = {
  [EMoveDirection.up]: {
    '0': '3',
    '1': '0',
    '2': '1',
    '3': '2',
  },
  [EMoveDirection.down]: {
    '0': '1',
    '1': '2',
    '2': '3',
    '3': '0',
  },
}

const moveShape = (
  pos: { x?: number; y?: number },
  shape: Shape,
  gameGrid: GameGrid
) => {
  const shapeIds = shape.blocks.map((b) => b.id)
  const shapeBlocks = gameGrid.blocks.filter((b) => shapeIds.includes(b.id))
  shapeBlocks.forEach((block) => {
    if (pos.x) {
      shape.x = pos.x
      block.x += shape.x
    }
    if (pos.y) {
      shape.y = pos.y
      block.y += shape.y
    }
  })
}

const createShapeBlocks = (
  shapeName: string,
  shape: { x: number; y: number }
): Block[] => {
  return (Object.entries(rotationRules[shapeName]['0']) as any).map(
    ([localId, pos]: [string, { x: number; y: number }]) => {
      return {
        x: pos.x + shape.x,
        y: pos.y + shape.y,
        group: shapeName,
        id: uniqueId(shapeName),
        localId,
      }
    }
  )
}

const rotateShapeBlocks = (
  rotation: Rotation,
  shape: Shape,
  gameGrid: GameGrid
) => {
  const group = shape.blocks[0].group
  const shapeIds = shape.blocks.map((b) => b.id)
  const shapeBlocks = gameGrid.blocks.filter((b) => shapeIds.includes(b.id))
  shape.rotation = rotation
  const mY = minY(shapeBlocks)
  const mX = minX(shapeBlocks)
  shapeBlocks.forEach((block) => {
    const { localId } = block
    block.x = rotationRules[group][rotation][String(localId)].x + mX
    block.y = rotationRules[group][rotation][String(localId)].y + mY
  })
}

const minY = (blocks: Block[]) => Math.min(...blocks.map((b) => b.y))
const minX = (blocks: Block[]) => Math.min(...blocks.map((b) => b.x))

const createRandomShape = (): Shape => {
  const pos = { x: 5, y: -1 }
  const blocks = Object.keys(rotationRules)
  const newBlockName = blocks[random(0, blocks.length - 1)]
  return {
    rotation: '0',
    ...pos,
    blocks: createShapeBlocks(newBlockName, pos),
  }
}

const rotationRules: Record<string, any> = {
  turnedLeft: {
    '0': {
      '1': { x: 0, y: 0 },
      '2': { x: 1, y: 0 },
      '3': { x: 2, y: 0 },
      '4': { x: 0, y: 1 },
    },
    '1': {
      '1': { x: 1, y: 0 },
      '2': { x: 1, y: 1 },
      '3': { x: 1, y: 2 },
      '4': { x: 0, y: 0 },
    },
    '2': {
      '1': { x: 0, y: 1 },
      '2': { x: 1, y: 1 },
      '3': { x: 2, y: 1 },
      '4': { x: 2, y: 0 },
    },
    '3': {
      '1': { x: 0, y: 0 },
      '2': { x: 0, y: 1 },
      '3': { x: 0, y: 2 },
      '4': { x: 1, y: 2 },
    },
  },
  turnedRight: {
    '0': {
      '1': { x: 0, y: 0 },
      '2': { x: 1, y: 0 },
      '3': { x: 2, y: 0 },
      '4': { x: 2, y: 1 },
    },
    '1': {
      '1': { x: 1, y: 0 },
      '2': { x: 1, y: 1 },
      '3': { x: 1, y: 2 },
      '4': { x: 0, y: 2 },
    },
    '2': {
      '1': { x: 0, y: 1 },
      '2': { x: 1, y: 1 },
      '3': { x: 2, y: 1 },
      '4': { x: 0, y: 0 },
    },
    '3': {
      '1': { x: 0, y: 0 },
      '2': { x: 0, y: 1 },
      '3': { x: 0, y: 2 },
      '4': { x: 1, y: 0 },
    },
  },
  blasteroid: {
    '0': {
      '1': { x: 1, y: 0 },
      '2': { x: 0, y: 1 },
      '3': { x: 1, y: 1 },
      '4': { x: 2, y: 1 },
    },
    '1': {
      '1': { x: 1, y: 0 },
      '2': { x: 1, y: 1 },
      '3': { x: 1, y: 2 },
      '4': { x: 0, y: 1 },
    },
    '2': {
      '1': { x: 1, y: 1 },
      '2': { x: 0, y: 0 },
      '3': { x: 1, y: 0 },
      '4': { x: 2, y: 0 },
    },
    '3': {
      '1': { x: 0, y: 0 },
      '2': { x: 0, y: 1 },
      '3': { x: 0, y: 2 },
      '4': { x: 1, y: 1 },
    },
  },
  movedRight: {
    '0': {
      '1': { x: 1, y: 0 },
      '2': { x: 2, y: 0 },
      '3': { x: 0, y: 1 },
      '4': { x: 1, y: 1 },
    },
    '1': {
      '1': { x: 0, y: 0 },
      '2': { x: 0, y: 1 },
      '3': { x: 1, y: 1 },
      '4': { x: 1, y: 2 },
    },
    '2': {
      '1': { x: 1, y: 0 },
      '2': { x: 2, y: 0 },
      '3': { x: 0, y: 1 },
      '4': { x: 1, y: 1 },
    },
    '3': {
      '1': { x: 0, y: 0 },
      '2': { x: 0, y: 1 },
      '3': { x: 1, y: 1 },
      '4': { x: 1, y: 2 },
    },
  },
  movedLeft: {
    '0': {
      '1': { x: 0, y: 0 },
      '2': { x: 1, y: 0 },
      '3': { x: 1, y: 1 },
      '4': { x: 2, y: 1 },
    },
    '1': {
      '1': { x: 1, y: 0 },
      '2': { x: 1, y: 1 },
      '3': { x: 0, y: 1 },
      '4': { x: 0, y: 2 },
    },
    '2': {
      '1': { x: 2, y: 1 },
      '2': { x: 1, y: 1 },
      '3': { x: 1, y: 0 },
      '4': { x: 0, y: 0 },
    },
    '3': {
      '1': { x: 1, y: 0 },
      '2': { x: 1, y: 1 },
      '3': { x: 0, y: 1 },
      '4': { x: 0, y: 2 },
    },
  },
  lineVertical: {
    '0': {
      '1': { x: 0, y: 0 },
      '2': { x: 0, y: 1 },
      '3': { x: 0, y: 2 },
      '4': { x: 0, y: 3 },
    },
    '1': {
      '1': { x: 0, y: 0 },
      '2': { x: 1, y: 0 },
      '3': { x: 2, y: 0 },
      '4': { x: 3, y: 0 },
    },
    '2': {
      '1': { x: 0, y: 0 },
      '2': { x: 0, y: 1 },
      '3': { x: 0, y: 2 },
      '4': { x: 0, y: 3 },
    },
    '3': {
      '1': { x: 0, y: 0 },
      '2': { x: 1, y: 0 },
      '3': { x: 2, y: 0 },
      '4': { x: 3, y: 0 },
    },
  },
  lineHorizontal: {
    '0': {
      '1': { x: 0, y: 0 },
      '2': { x: 1, y: 0 },
      '3': { x: 2, y: 0 },
      '4': { x: 3, y: 0 },
    },
    '1': {
      '1': { x: 0, y: 0 },
      '2': { x: 0, y: 1 },
      '3': { x: 0, y: 2 },
      '4': { x: 0, y: 3 },
    },
    '2': {
      '1': { x: 0, y: 0 },
      '2': { x: 1, y: 0 },
      '3': { x: 2, y: 0 },
      '4': { x: 3, y: 0 },
    },
    '3': {
      '1': { x: 0, y: 0 },
      '2': { x: 0, y: 1 },
      '3': { x: 0, y: 2 },
      '4': { x: 0, y: 3 },
    },
  },
  rectangle: {
    '0': {
      '1': { x: 0, y: 0 },
      '2': { x: 1, y: 0 },
      '3': { x: 0, y: 1 },
      '4': { x: 1, y: 1 },
    },
    '1': {
      '1': { x: 0, y: 0 },
      '2': { x: 1, y: 0 },
      '3': { x: 0, y: 1 },
      '4': { x: 1, y: 1 },
    },
    '2': {
      '1': { x: 0, y: 0 },
      '2': { x: 1, y: 0 },
      '3': { x: 0, y: 1 },
      '4': { x: 1, y: 1 },
    },
    '3': {
      '1': { x: 0, y: 0 },
      '2': { x: 1, y: 0 },
      '3': { x: 0, y: 1 },
      '4': { x: 1, y: 1 },
    },
  },
}