import { uniqueId } from 'lodash'
import { FType, State } from '~/src/Common/cpu/utils/system'
import { GameGrid, GameSettings } from '~/src/Common/cpu/providers/types/Game'
import { Block } from '~/src/Common/cpu/providers/types/Block'
import { EMoveDirection } from '~/src/Common/Types/GameTypes'

type Rotation = '0' | '1' | '2' | '3'

type Shape = {
  rotation: Rotation
  x: number
  y: number
  blocks: Block[]
}

export const useTetris = (
  getGameSettings: FType<State<GameSettings>>,
  getGameGrid: FType<State<GameGrid>>,
  doTimer: FType<void, [number, () => void]>
) => {
  const gameSettings = getGameSettings()
  const gameGrid = getGameGrid()
  let shape: Shape = createRandomShape()
  gameGrid.get().blocks.push(...shape.blocks)

  // rotateShapeBlocks('2', shape)

  const nextFrame = () => {
    doTimer(gameSettings.get().speed, () => {
      gameSettings.get().frameCounter += 1
      moveShape({ y: 1 }, shape, gameGrid.get())

      // Проверить что фигура коснулась границы
      const mxY = maxY(shape.blocks)

      if (mxY >= gameGrid.get().gameSize.height - 1) {
        shape = createRandomShape()
        gameGrid.get().blocks.push(...shape.blocks)
      }
      console.log('mxy', mxY)

      nextFrame()
    })
  }

  return {
    start() {
      nextFrame()
    },
    pause() {},
    moveByX(x: number) {
      moveShape({ x }, shape, gameGrid.get())
    },
    moveDown() {
      moveShape({ y: 1 }, shape, gameGrid.get())
    },
    direction(newDirection: EMoveDirection) {
      gameSettings.get().direction = newDirection

      if (
        newDirection === EMoveDirection.up ||
        newDirection === EMoveDirection.down
      ) {
        rotateShapeBlocks(
          rotationTransitions[newDirection][shape.rotation],
          shape,
          gameGrid.get()
        )
      }
    },
    stop() {},
  }
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
  console.log('rotation', rotation)
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
