import { effect } from '~~/app/systemModules/base/effect'
import {
  gameInContext,
  renderServiceInContext,
} from '~~/app/appModules/context'
import {
  EKeyCode,
  KeysToMoveCamera3,
  KeysToMoveMap,
} from '~~/src/Common/Types/GameTypes'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'
import { KeyPress } from '~~/app/appModules/keyPress/keyPressModel'

export const doKeyPress = effect<typeof KeyPress>((keyCode) => {
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
})
