import { uniqueId } from 'lodash'
import { FType, State } from '~/src/Common/cpu/utils/system'
import { GameGrid, GameSettings } from '~/src/Common/cpu/providers/types/Game'
import { Block } from '~/src/Common/cpu/providers/types/Block'
import { EMoveDirection } from '~/src/Common/Types/GameTypes'

type Shape = {
  rotation?: 0 | 1 | 2 | 3
  x: number
  y: number
  blocks: Block[]
}

export const useTetris = (
  getGameSettings: FType<State<GameSettings>>,
  getGameGrid: FType<State<GameGrid>>,
  doTimer: FType<void, [number, () => void]>
) => {
  const gameSettings = getGameSettings()
  const gameGrid = getGameGrid()
  const shape: Shape = {
    x: 0,
    y: 0,
    blocks: turnedLeft(),
  }
  gameGrid.get().blocks.push(...shape.blocks)

  shape.y = 12
  shape.x = 4
  moveShape(shape)

  const nextFrame = () => {
    doTimer(gameSettings.get().speed, () => {
      gameSettings.get().frameCounter += 1
      console.log('frame')
      nextFrame()
    })
  }

  return {
    start() {
      nextFrame()
    },
    pause() {},
    direction(newDirection: EMoveDirection) {
      gameSettings.get().direction = newDirection
    },
    stop() {},
  }
}

const moveShape = (shape: Shape) => {
  shape.blocks.forEach((block) => {
    block.x += shape.x
    block.y += shape.y
  })
}

const rectangle = () => [
  { x: 0, y: 0, id: uniqueId('rect_'), group: 'shape' },
  { x: 1, y: 0, id: uniqueId('rect_'), group: 'shape' },
  { x: 0, y: 1, id: uniqueId('rect_'), group: 'shape' },
  { x: 1, y: 1, id: uniqueId('rect_'), group: 'shape' },
]
const lineHorizontal = () => [
  { x: 0, y: 0, id: uniqueId('line_h_'), group: 'shape' },
  { x: 0, y: 1, id: uniqueId('line_h_'), group: 'shape' },
  { x: 0, y: 2, id: uniqueId('line_h_'), group: 'shape' },
  { x: 0, y: 3, id: uniqueId('line_h_'), group: 'shape' },
]
const lineVertical = () => [
  { y: 0, x: 0, id: uniqueId('line_v_'), group: 'shape' },
  { y: 0, x: 1, id: uniqueId('line_v_'), group: 'shape' },
  { y: 0, x: 2, id: uniqueId('line_v_'), group: 'shape' },
  { y: 0, x: 3, id: uniqueId('line_v_'), group: 'shape' },
]

const movedLeft = () => [
  { x: 0, y: 0, id: uniqueId('moved_l_'), group: 'shape' },
  { x: 1, y: 0, id: uniqueId('moved_l_'), group: 'shape' },
  { x: 1, y: 1, id: uniqueId('moved_l_'), group: 'shape' },
  { x: 2, y: 1, id: uniqueId('moved_l_'), group: 'shape' },
]
const movedRight = () => [
  { x: 1, y: 0, id: uniqueId('moved_r_'), group: 'shape' },
  { x: 2, y: 0, id: uniqueId('moved_r_'), group: 'shape' },
  { x: 0, y: 1, id: uniqueId('moved_r_'), group: 'shape' },
  { x: 1, y: 1, id: uniqueId('moved_r_'), group: 'shape' },
]
const blasteroid = () => [
  { x: 1, y: 0, id: uniqueId('blaster_'), group: 'shape' },
  { x: 0, y: 1, id: uniqueId('blaster_'), group: 'shape' },
  { x: 1, y: 1, id: uniqueId('blaster_'), group: 'shape' },
  { x: 2, y: 1, id: uniqueId('blaster_'), group: 'shape' },
]
const turnedRight = () => [
  { x: 0, y: 0, id: uniqueId('turned_r_'), group: 'shape' },
  { x: 1, y: 0, id: uniqueId('turned_r_'), group: 'shape' },
  { x: 2, y: 0, id: uniqueId('turned_r_'), group: 'shape' },
  { x: 2, y: 1, id: uniqueId('turned_r_'), group: 'shape' },
]
const turnedLeft = () => [
  { x: 0, y: 0, id: uniqueId('turned_l_'), group: 'shape' },
  { x: 1, y: 0, id: uniqueId('turned_l_'), group: 'shape' },
  { x: 2, y: 0, id: uniqueId('turned_l_'), group: 'shape' },
  { x: 0, y: 1, id: uniqueId('turned_l_'), group: 'shape' },
]
