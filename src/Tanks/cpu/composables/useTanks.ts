import { EMoveDirection } from './../../../Common/Types/GameTypes'
import { GameGrid, GameSettings } from '~~/src/Common/cpu/providers/types/Game'
import { FType, State } from '~~/src/Common/cpu/utils/system'

export const useTanks = (
  getGameSettings: FType<State<GameSettings>>,
  getGameGrid: FType<State<GameGrid>>,
  doTimer: FType<void, [number, () => void]>
) => {
  const gameSettings = getGameSettings()
  const gameGrid = getGameGrid()

  const nextFrame = () => {
    doTimer(gameSettings.get().speed, () => {
      gameSettings.get().frameCounter += 1
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
