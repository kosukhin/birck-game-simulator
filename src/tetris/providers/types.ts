import { Block } from '~/src/common/types/Block'
import { Game } from '~/src/common/types/Game'

export type Rotation = '0' | '1' | '2' | '3'

export type Shape = {
  rotation: Rotation
  x: number
  y: number
  blocks: Block[]
}

export type TetrisGame = Game & {
  shape: Shape | null
}
