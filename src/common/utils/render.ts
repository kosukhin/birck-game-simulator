import { curry } from 'lodash'
import { Block, Shape } from '~/src/common/types/Block'
import { Game, GameGrid } from '~/src/common/types/Game'
import { EMoveDirection } from '~/src/common/types/GameTypes'

export const calculateShapeStepToDirection = (shape: Shape) => {
  const xDelta =
    (shape.direction === EMoveDirection.left && -1) ||
    (shape.direction === EMoveDirection.right && 1) ||
    0
  const yDelta =
    (shape.direction === EMoveDirection.up && -1) ||
    (shape.direction === EMoveDirection.down && 1) ||
    0

  return {
    xDelta,
    yDelta,
  }
}

export const moveShapeToDirection = curry((shape: Shape, game: Game): Game => {
  const step = calculateShapeStepToDirection(shape)
  shape.x += step.xDelta
  shape.y += step.yDelta
  game.grid.blocks.forEach((block) => {
    if (shape.blocks.some((shapeBlock) => shapeBlock.id === block.id)) {
      block.x += step.xDelta
      block.y += step.yDelta
    }
  })

  return game
})

export const renderShapeToGrid = (shape: Shape, grid: GameGrid) => {
  shape.blocks.forEach((block) => {
    block.x += shape.x
    block.y += shape.y
  })
  grid.blocks.push(...shape.blocks)
}

export const renderBlocksToGrid = (blocks: Block[], grid: GameGrid) => {
  grid.blocks.push(...blocks)
}

export const incrementFrameCounter = (context: Game) => {
  context.settings.frameCounter += 1
  return context
}
