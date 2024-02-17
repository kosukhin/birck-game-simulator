import { Block } from '~~/src/Common/cpu/providers/types/Block'
import { EMoveDirection } from '~/src/Common/Types/GameTypes'

export interface GameSettings {
  frameCounter: number
  speed: number
  score: number
  isGameOver: boolean
  isPaused: boolean
  direction: EMoveDirection
}

export interface GameSize {
  width: number
  height: number
}

export interface GameGrid {
  blocks: Block[]
  gameSize: GameSize
}

export interface Game {
  settings: GameSettings
  grid: GameGrid
}
