import { GameGrid, GameSettings } from '~~/src/Common/cpu/providers/types/Game'
import { FType, State } from '~~/src/Common/cpu/utils/system'

export const useBlasteroid = (
  getGameSettings: FType<State<GameSettings>>,
  getGameGrid: FType<State<GameGrid>>
) => {
  const gameSettings = getGameSettings()
  const gameGrid = getGameGrid()

  return {
    start() {},
    pause() {},
    moveByX(step: number) {},
    shoot() {},
  }
}
