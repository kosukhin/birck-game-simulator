import { Shape } from '~/src/common/types/Block'
import { Game } from '~/src/common/types/Game'

export const calculateShapeHeight = (shape: Shape, game: Game) => {
  const shapeBlock = shape.blocks[0]
  const shapeBlocks = game.grid.blocks.filter(
    (block) => block.group === shapeBlock.group
  )
  return Math.max(...shapeBlocks.map((block) => block.y - shape.y)) + 1
}
