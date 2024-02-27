import { random, uniqueId } from 'lodash'
import { Shape } from '~/src/tetris/providers/types'

export const createRandomShape = (
  rotationRules: Record<string, any>
): Shape => {
  const pos = { x: 5, y: -1 }
  const blocks = Object.keys(rotationRules)
  const newBlockName = blocks[random(0, blocks.length - 1)]
  return {
    rotation: '0',
    ...pos,
    blocks: (Object.entries(rotationRules[newBlockName]['0']) as any).map(
      ([localId, shape]: [string, { x: number; y: number }]) => {
        return {
          x: pos.x + shape.x,
          y: pos.y + shape.y,
          group: newBlockName,
          id: uniqueId(newBlockName),
          localId,
        }
      }
    ),
  }
}
