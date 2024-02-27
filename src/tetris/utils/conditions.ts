import { Game } from '~/src/common/types/Game'
import { ShapeContainer, TetrisGame } from '~/src/tetris/providers/types'

export const checkGameOver = (game: Game) => {
  game.settings.isGameOver = game.grid.blocks.some((block) => {
    return block.y < 0
  })
}

export const isShapeStuckToEnd = (game: TetrisGame & ShapeContainer) => {
  return game.shape.blocks.some((block) => {
    const nextY = block.y + 1
    return nextY >= game.grid.gameSize.height
  })
}

export const isShapeStuckToBlock = (game: TetrisGame & ShapeContainer) => {
  const shapeIds = game.shape.blocks.map((b) => b.id)
  const shapeBlocks = game.grid.blocks.filter((b) => shapeIds.includes(b.id))
  const staticBlocks = game.grid.blocks.filter((b) => !shapeIds.includes(b.id))
  return staticBlocks.some((block) =>
    shapeBlocks.some(
      (shapeBlock) => shapeBlock.x === block.x && shapeBlock.y + 1 === block.y
    )
  )
}

export const isShapeStuckByWidth = (
  x: number,
  game: TetrisGame & ShapeContainer
) => {
  return game.shape.blocks.some((block) => {
    const nextX = block.x + x
    return nextX < 0 || nextX >= game.grid.gameSize.width
  })
}

export const isShapeStuckToBlockByX = (game: TetrisGame & ShapeContainer) => {
  const shapeIds = game.shape.blocks.map((b) => b.id)
  const shapeBlocks = game.grid.blocks.filter((b) => shapeIds.includes(b.id))
  const staticBlocks = game.grid.blocks.filter((b) => !shapeIds.includes(b.id))
  return staticBlocks.some((block) =>
    shapeBlocks.some(
      (shapeBlock) =>
        (shapeBlock.x + 1 === block.x || shapeBlock.x - 1 === block.x) &&
        shapeBlock.y === block.y
    )
  )
}
