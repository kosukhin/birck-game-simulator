import { EMoveDirection } from '~~/src/Common/Types/GameTypes'

/**
 * Общая абстракция блока игры
 * тк вся игра состоит из блоков
 * это основной элемент
 */
export interface Block {
  x: number
  y: number
  id: string
  group: string
  localId?: string
  localGroup?: string
}

/**
 * Абстракция фигуры из блоков
 */
export interface Shape {
  x: number
  y: number
  direction: EMoveDirection
  blocks: Block[]
  width?: number
  height?: number
}
