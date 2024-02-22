import { GameGrid } from '~~/src/common/types/Game'
import { Block } from '~~/src/common/types/Block'
import { TGrid } from '~~/src/common/types/GridTypes'
import {
  EMoveDirection,
  ReverseDirections,
} from '~~/src/common/types/GameTypes'

export const gameGridToMGrid = (gameGrid: GameGrid): TGrid => {
  const bgBitmap: number[][] = []
  const blocksMap: Record<string, Block> = gameGrid.blocks.reduce(
    (acc: Record<string, Block>, item) => {
      acc[item.x + '-' + item.y] = item
      return acc
    },
    {}
  )

  for (let i = 0; i < gameGrid.gameSize.height; i++) {
    if (!bgBitmap[i]) {
      bgBitmap[i] = []
    }
    for (let j = 0; j < gameGrid.gameSize.width; j++) {
      bgBitmap[i][j] = Number(!!blocksMap[j + '-' + i])
    }
  }

  return bgBitmap
}

export const isReverseDirection = (
  direction: EMoveDirection,
  newDirection: EMoveDirection
) => {
  const reverseDirection = ReverseDirections[newDirection]

  return reverseDirection === direction
}
