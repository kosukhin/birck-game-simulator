import {
  EKeyCode,
  KeysToMoveCamera3,
  KeysToMoveMap,
} from './../../src/Common/Types/GameTypes'
import {
  gameInContext,
  renderServiceInContext,
} from '~~/app/appModules/inContext'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

export function doKeyPress(keyCode: EKeyCode) {
  if (KeysToMoveMap[keyCode] !== undefined) {
    let newDirection = KeysToMoveMap[keyCode]

    if (keyCode === EKeyCode.W || keyCode === EKeyCode.S) {
      return
    }

    const game = gameInContext<WfSnake>()
    const currentDirection = game.snake.direction
    newDirection = KeysToMoveCamera3[currentDirection][keyCode]

    game.moveSnake(newDirection)
    const renderService = renderServiceInContext()
    renderService.setLeadDirection(newDirection)
  }
}
