import { uniqueId } from 'lodash'
import { EMoveDirection } from './../../../Common/Types/GameTypes'
import { Block } from '~~/src/Common/cpu/providers/types/Block'
import { GameGrid, GameSettings } from '~~/src/Common/cpu/providers/types/Game'
import { FType, State } from '~~/src/Common/cpu/utils/system'

export const useTanks = (
  getGameSettings: FType<State<GameSettings>>,
  getGameGrid: FType<State<GameGrid>>,
  doTimer: FType<void, [number, () => void]>
) => {
  const gameSettings = getGameSettings()
  const gameGrid = getGameGrid()

  gameGrid.get().blocks.push(...tankScheme)

  const nextFrame = () => {
    doTimer(gameSettings.get().speed, () => {
      gameSettings.get().frameCounter += 1
      console.log('next frame')
      tanksMainCycle(gameGrid.get())
      !gameSettings.get().isGameOver &&
        !gameSettings.get().isPaused &&
        nextFrame()
    })
  }

  return {
    start: nextFrame,
    pause() {
      gameSettings.get().isPaused = !gameSettings.get().isPaused
      gameSettings.get().isPaused && nextFrame()
    },
    moveByX(x: number) {
      console.log(x, gameGrid.get())
    },
    moveDown() {
      console.log(gameGrid.get())
    },
    direction(newDirection: EMoveDirection) {
      console.log(newDirection)
    },
  }
}

const tanksMainCycle = (gameGrid: GameGrid) => {}

const tankScheme: Block[] = [
  { x: 0, y: 0, id: uniqueId('tank_'), group: 'tank' },
  { x: 1, y: 0, id: uniqueId('tank_'), group: 'tank' },
  { x: 1, y: 1, id: uniqueId('tank_'), group: 'tank' },
  { x: 2, y: 1, id: uniqueId('tank_'), group: 'tank' },
  { x: 0, y: 2, id: uniqueId('tank_'), group: 'tank' },
  { x: 1, y: 2, id: uniqueId('tank_'), group: 'tank' },
]
