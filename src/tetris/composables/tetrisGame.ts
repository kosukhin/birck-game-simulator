import { random, uniqueId } from 'lodash'
import { Intention } from '~/src/common/library/Intention'
import { repeat } from '~/src/common/utils/actions'
import { ensureNotGameOver, ensureNotPaused } from '~/src/common/utils/checks'
import {
  booleanToPromise,
  noError,
  resolve,
  skipNextThens,
  whenFrameReady,
} from '~/src/common/utils/fp'
import {
  rotationDirectionTransitions,
  rotationRules,
  rotationTransitions,
} from '~/src/tetris/providers/blocks'
import { Rotation, Shape, TetrisGame } from '~/src/tetris/providers/types'
import { Block } from '~~/src/common/types/Block'
import { Game, GameGrid, GameSettings } from '~~/src/common/types/Game'
import { EMoveDirection } from '~~/src/common/types/GameTypes'
import { FType } from '~~/src/common/utils/system'

const fallStaticBlocks = (game: Game) => {
  const staticBlocks = game.grid.blocks
  let hasBlocksToFall = false
  const blocksGrid = staticBlocks.reduce((acc: any, item) => {
    acc['' + item.y + item.x] = 1
    return acc
  }, {})
  staticBlocks.forEach((block) => {
    const nextY = block.y + 1
    const notLast = nextY < game.grid.gameSize.height
    const noBottomBlock = !blocksGrid['' + nextY + block.x]
    if (notLast && noBottomBlock) {
      block.y += 1
      hasBlocksToFall = true
    }
  })
  if (hasBlocksToFall) {
    fallStaticBlocks(game)
  }
}

const checkGameOver = (game: Game) => {
  game.settings.isGameOver = game.grid.blocks.some((block) => {
    return block.y < 0
  })
}

const createShape = (game: TetrisGame) => {
  game.shape = createRandomShape()
  game.grid.blocks.push(...game.shape.blocks)
}

const checkShapeMustStop = (game: TetrisGame) => {
  return !game.shape || isShapeStuckToEnd(game) || isShapeStuckToBlock(game)
}

const stopShapeIfNeed = (game: TetrisGame) => {
  checkShapeMustStop(game) && (game.shape = null)
}

const isShapeStuckToEnd = (game: TetrisGame) => {
  return (
    game.shape &&
    game.shape.blocks.some((block) => {
      const nextY = block.y + 1
      return nextY >= game.grid.gameSize.height
    })
  )
}

const isShapeStuckToBlock = (game: TetrisGame) => {
  if (!game.shape) {
    return false
  }

  const shapeIds = game.shape.blocks.map((b) => b.id)
  const shapeBlocks = game.grid.blocks.filter((b) => shapeIds.includes(b.id))
  const staticBlocks = game.grid.blocks.filter((b) => !shapeIds.includes(b.id))
  return staticBlocks.some((block) =>
    shapeBlocks.some(
      (shapeBlock) => shapeBlock.x === block.x && shapeBlock.y + 1 === block.y
    )
  )
}

const isShapeStuckByWidth = (x: number, game: TetrisGame) => {
  return (
    game.shape &&
    game.shape.blocks.some((block) => {
      const nextX = block.x + x
      return nextX < 0 || nextX >= game.grid.gameSize.width
    })
  )
}

const isShapeStuckToBlockByX = (game: TetrisGame) => {
  if (!game.shape) {
    return false
  }

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

const checkLineFilled = (game: TetrisGame): number => {
  const filled = removeFilledLines(game.grid)
  if (filled) {
    game.shape = null
    fallStaticBlocks(game)
  }
  return filled
}

const incrementScore = (filledLines: number, gameSettings: GameSettings) => {
  gameSettings.score += filledLines
  gameSettings.speed -= filledLines * 10
}

const moveShapeByX = (x: number, game: TetrisGame) => {
  resolve(game)
    .then(
      booleanToPromise(
        'shape stuck',
        () =>
          !(
            !game.shape ||
            isShapeStuckByWidth(x, game) ||
            isShapeStuckToBlockByX(game)
          )
      )
    )
    .catch(skipNextThens)
    .then(() => {
      moveShape({ x }, game.shape as Shape, game)
      return game
    })
    .catch(noError)
}

const moveShapeDown = (game: TetrisGame) => {
  resolve(game)
    .then(booleanToPromise('must stop shape', () => !checkShapeMustStop(game)))
    .catch(skipNextThens)
    .then((context: any) => {
      game.shape && moveShape({ y: 1 }, game.shape, game)
      return context
    })
    .catch(noError)
}

const rotateShape = (direction: EMoveDirection, game: TetrisGame) => {
  new Intention(game)
    .predicate(() => {
      if (!game.shape) {
        return false
      }

      const backDirection = (rotationDirectionTransitions as any)[direction]
      rotateShapeBlocks(
        (rotationTransitions as any)[direction][game.shape.rotation],
        game.shape,
        game.grid
      )
      if (checkShapeMustStop(game) || isShapeStuckByWidth(0, game)) {
        rotateShapeBlocks(
          (rotationTransitions as any)[backDirection][game.shape.rotation],
          game.shape,
          game.grid
        )
        return false
      }

      rotateShapeBlocks(
        (rotationTransitions as any)[backDirection][game.shape.rotation],
        game.shape,
        game.grid
      )
      return true
    })
    .map((gameGrid: GameGrid) => {
      game.settings.direction = direction

      if (direction === EMoveDirection.up && game.shape) {
        rotateShapeBlocks(
          rotationTransitions[direction][game.shape.rotation],
          game.shape,
          gameGrid
        )
      }

      return gameGrid
    })
}

export const useTetris = (
  getGameSettings: FType<GameSettings>,
  getGameGrid: FType<GameGrid>
) => {
  const game: TetrisGame = {
    settings: getGameSettings(),
    grid: getGameGrid(),
    shape: null,
  }

  return {
    start: () => startGame(game),
    pause() {
      game.settings.isPaused = !game.settings.isPaused
      !game.settings.isPaused && startGame(game)
    },
    moveByX(x: number) {
      moveShapeByX(x, game)
    },
    moveDown() {
      moveShapeDown(game)
    },
    direction(newDirection: EMoveDirection) {
      rotateShape(newDirection, game)
    },
  }
}

const startGame = (game: Game): Promise<Game> =>
  whenFrameReady(game)
    .then(ensureNotGameOver)
    .then(ensureNotPaused)
    .catch(skipNextThens)
    .then(renderGameFrame)
    .then(
      repeat(
        () => startGame(game),
        () => game.settings.speed
      )
    )
    .catch(noError)

const renderGameFrame = (game: TetrisGame) => {
  !game.shape && createShape(game)
  stopShapeIfNeed(game)
  moveShapeDown(game)
  incrementScore(checkLineFilled(game), game.settings)
  checkGameOver(game)
  return game
}

const removeFilledLines = (gameGrid: GameGrid) => {
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

const moveShape = (
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

const createShapeBlocks = (
  shapeName: string,
  shape: { x: number; y: number }
): Block[] => {
  return (Object.entries(rotationRules[shapeName]['0']) as any).map(
    ([localId, pos]: [string, { x: number; y: number }]) => {
      return {
        x: pos.x + shape.x,
        y: pos.y + shape.y,
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

const createRandomShape = (): Shape => {
  const pos = { x: 5, y: -1 }
  const blocks = Object.keys(rotationRules)
  const newBlockName = blocks[random(0, blocks.length - 1)]
  return {
    rotation: '0',
    ...pos,
    blocks: createShapeBlocks(newBlockName, pos),
  }
}
