import { GameGrid } from '~/src/common/types/Game'
import { HMath } from '~/src/common/utils/HMath'

export const moveTargetToRandomPlace = (gameGrid: GameGrid) => {
  const newX = HMath.random(0, gameGrid.gameSize.width - 1)
  const newY = HMath.random(0, gameGrid.gameSize.height - 1)

  if (gameGrid.blocks.some((block) => block.x === newX && block.y === newY)) {
    moveTargetToRandomPlace(gameGrid)
  } else {
    const [target] = gameGrid.blocks
    target.x = newX
    target.y = newY
  }
}

export const addBlockToTail = (gameGrid: GameGrid) => {
  const [, lead] = gameGrid.blocks
  gameGrid.blocks.push({
    ...lead,
    id: 'tail' + gameGrid.blocks.length,
    group: 'tail',
  })
}
