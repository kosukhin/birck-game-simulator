import { Block, Shape } from '~~/src/common/types/Block'
import { EMoveDirection } from '~~/src/common/types/GameTypes'

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

export interface ShapeInGame {
  shape: Shape
  game: Game
}
