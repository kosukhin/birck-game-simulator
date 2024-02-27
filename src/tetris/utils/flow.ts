import { minX, minY } from '~/src/common/utils/HMath'
import { Rotation, Shape, TetrisGame } from '~/src/tetris/providers/types'
import { Game, GameGrid, GameSettings } from '~~/src/common/types/Game'

export const fallStaticBlocks = (game: Game) => {
  const blocksGrid = game.grid.blocks.reduce((acc: any, item) => {
    acc['' + item.y + item.x] = 1
    return acc
  }, {})

  let hasBlocksToFall = false
  game.grid.blocks.forEach((block) => {
    const nextY = block.y + 1
    const notLast = nextY < game.grid.gameSize.height
    const noBottomBlock = !blocksGrid['' + nextY + block.x]
    if (notLast && noBottomBlock) {
      block.y += 1
      hasBlocksToFall = true
    }
  })

  hasBlocksToFall && fallStaticBlocks(game)
}

export const stopShape = (game: TetrisGame) => {
  game.shape = null
}

export const incrementScore = (
  filledLines: number,
  gameSettings: GameSettings
) => {
  gameSettings.score += filledLines
  gameSettings.speed -= filledLines * 10
}

export const removeFilledLines = (gameGrid: GameGrid) => {
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

export const moveShape = (
  pos: { x?: number; y?: number },
  shape: Shape,
  game: Game
) => {
  const shapeIds = shape.blocks.map((b) => b.id)
  const shapeBlocks = game.grid.blocks.filter((b) => shapeIds.includes(b.id))
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

export const rotateShapeBlocks = (
  rotationRules: Record<string, any>,
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
