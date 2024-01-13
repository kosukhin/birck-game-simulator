import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import {
  EKeyCode,
  KeysToMoveCamera3,
  KeysToMoveMap,
} from '~~/src/Common/Types/GameTypes'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

export function handleKey(
  getKey: () => EKeyCode,
  getGame: () => WfSnake,
  getRenderService: () => RenderService
): void {
  const keyCode = getKey()

  if (KeysToMoveMap[keyCode] !== undefined) {
    let newDirection = KeysToMoveMap[keyCode]

    if (keyCode === EKeyCode.W || keyCode === EKeyCode.S) {
      return
    }

    const game = getGame()
    const currentDirection = game.snake.direction
    newDirection = KeysToMoveCamera3[currentDirection][keyCode]

    game.moveSnake(newDirection)
    const rs = getRenderService()
    rs.setLeadDirection(newDirection)
  }
}
