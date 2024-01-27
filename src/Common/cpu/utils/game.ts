import { GameGrid } from '~/src/Common/cpu/providers/types/Game'
import { Block } from '~/src/Common/cpu/providers/types/Block'
import { TGrid } from '~/src/Common/Types/GridTypes'

export const gameGridToMGrid = (gameGrid: GameGrid): TGrid => {
  const bgBitmap: number[][] = []
  const blocksMap: Record<string, Block> = gameGrid.blocks.reduce(
    (acc: Record<string, Block>, item) => {
      acc[item.x + '-' + item.y] = item
      return acc
    },
    {}
  )

  for (let i = 0; i < gameGrid.gameSize.width; i++) {
    if (!bgBitmap[i]) {
      bgBitmap[i] = []
    }
    for (let j = 0; j < gameGrid.gameSize.height; j++) {
      bgBitmap[i][j] = Number(!!blocksMap[j + '-' + i])
    }
  }

  return bgBitmap
}
