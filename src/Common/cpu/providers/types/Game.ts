import { Block } from '~~/src/Common/cpu/providers/types/Block'

export interface GameSettings {
  speed: number
  score: number
  isGameOver: boolean
  isPaused: boolean
}

export interface GameSize {
  width: number
  height: number
}

export interface GameGrid {
  blocks: Block[]
  gameSize: GameSize
}
