import { Game } from '~/src/common/types/Game'
import { Block } from '~~/src/common/types/Block'

export type SnakeGame = Game & {
  snake: Block[]
  target: Block
}
