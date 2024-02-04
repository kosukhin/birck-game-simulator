import { GameGrid } from '~/src/Common/cpu/providers/types/Game'
import { Block } from '~/src/Common/cpu/providers/types/Block'
import { TGrid } from '~/src/Common/Types/GridTypes'
import { EMoveDirection, ReverseDirections } from '~/src/Common/Types/GameTypes'

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
