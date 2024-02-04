import { uniqueId } from 'lodash'
import { FType, State } from '~/src/Common/cpu/utils/system'
import { GameGrid, GameSettings } from '~/src/Common/cpu/providers/types/Game'
import { Block } from '~/src/Common/cpu/providers/types/Block'
import { EMoveDirection } from '~/src/Common/Types/GameTypes'
import { Intention } from '~/src/Common/Library/Intention'

type Rotation = '0' | '1' | '2' | '3'

type Shape = {
  rotation: Rotation
  x: number
  y: number
  blocks: Block[]
}

let shape: Shape | null = null

// Как запустить цикл игры?
const snakeMainCycle = (gameGrid: GameGrid) => {
  !shape && createShape(gameGrid)
  stopShapeIfNeed(gameGrid)
  moveShapeDown(gameGrid)
  incrementScore(checkLineFilled(gameGrid), gameGrid)
}
// Как создать новую фигуру?
const createShape = (gameGrid: GameGrid) => {
  shape = createRandomShape()
  gameGrid.blocks.push(...shape.blocks)
}
// Как определить остановку фигуру?
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

// Как определить удаление линии?
const checkLineFilled = (gameGrid: GameGrid): number => {
  return 0
}
// Как увеличить счет если удалили линию?
const incrementScore = (filledLines: number, gameGrid: GameGrid) => {}

// Как отреагировать на перемещение по X?
const moveShapeByX = (x: number, gameGrid: GameGrid) => {
  new Intention(gameGrid)
    .predicate(() => {
      if (!shape) {
        return false
      }

      return (
        !shape.blocks.some((block) => {
          const nextX = block.x + x
          return nextX < 0 || nextX >= gameGrid.gameSize.width
        }) && !isShapeStuckToBlockByX(gameGrid)
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
      if (checkShapeMustStop(gameGrid)) {
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
          rotationTransitions[direction][shape.rotation],
          shape as Shape,
          gameGrid
        )
      }

      return gameGrid
    })
}
// Как отреагировать на поворот фигуры?
// Как отреагировать на ускорение фигуры

// Как предоставить интерфейс управления игрой?
export const useTetris = (
  getGameSettings: FType<State<GameSettings>>,
  getGameGrid: FType<State<GameGrid>>,
  doTimer: FType<void, [number, () => void]>
) => {
  const gameSettings = getGameSettings()
  const gameGrid = getGameGrid()

  const nextFrame = () => {
    doTimer(gameSettings.get().speed, () => {
      snakeMainCycle(gameGrid.get())
      nextFrame()
    })
  }

  return {
    start: nextFrame,
    pause() {},
    moveByX(x: number) {
      moveShapeByX(x, gameGrid.get())
    },
    moveDown() {
      moveShapeDown(gameGrid.get())
    },
    direction(newDirection: EMoveDirection) {
      rotateShape(newDirection, gameSettings.get(), gameGrid.get())
    },
    stop() {},
  }
}

const removeFilledLines = (gameGrid: GameGrid) => {
  const lines: Record<string, any> = {}
  gameGrid.blocks.forEach((block, index) => {
    if (!lines[block.y]) {
      lines[block.y] = {}
    }
    lines[block.y][block.x] = index
  })

  Object.entries(lines).forEach(([index, blocksMap]) => {
    const blocks = Object.values(blocksMap) as number[]
    if (blocks.length >= gameGrid.gameSize.width) {
      blocks.forEach((index: number) => {
        gameGrid.blocks.splice(index, 1)
      })
    }
  })
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

const createShapeBlocks = (shapeName: string): Block[] => {
  return (Object.entries(rotationRules[shapeName]['0']) as any).map(
    ([localId, pos]: [string, { x: number; y: number }]) => {
      return {
        ...pos,
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
const maxY = (blocks: Block[]) => Math.max(...blocks.map((b) => b.y))
const maxX = (blocks: Block[]) => Math.max(...blocks.map((b) => b.x))

const createRandomShape = (): Shape => {
  return {
    rotation: '0',
    x: 0,
    y: 0,
    blocks: createShapeBlocks('turnedRight'),
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
      '1': { x: 0, y: 0 },
      '2': { x: 0, y: 0 },
      '3': { x: 0, y: 0 },
      '4': { x: 0, y: 0 },
    },
    '2': {
      '1': { x: 0, y: 0 },
      '2': { x: 0, y: 0 },
      '3': { x: 0, y: 0 },
      '4': { x: 0, y: 0 },
    },
    '3': {
      '1': { x: 0, y: 0 },
      '2': { x: 0, y: 0 },
      '3': { x: 0, y: 0 },
      '4': { x: 0, y: 0 },
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
      '1': { x: 1, y: 0 },
      '2': { x: 2, y: 0 },
      '3': { x: 0, y: 1 },
      '4': { x: 1, y: 1 },
    },
    '2': {
      '1': { x: 1, y: 0 },
      '2': { x: 2, y: 0 },
      '3': { x: 0, y: 1 },
      '4': { x: 1, y: 1 },
    },
    '3': {
      '1': { x: 1, y: 0 },
      '2': { x: 2, y: 0 },
      '3': { x: 0, y: 1 },
      '4': { x: 1, y: 1 },
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
