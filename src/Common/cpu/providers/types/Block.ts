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
}
