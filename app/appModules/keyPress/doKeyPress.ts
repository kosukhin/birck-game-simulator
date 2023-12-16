import {
  gameInContext,
  renderServiceInContext,
} from '~~/app/appModules/context'
import { keyPressModel } from '~~/app/appModules/keyPress/keyPressModel'
import { defineModelEffect } from '~~/src/Common/Library/I'
import {
  EKeyCode,
  KeysToMoveCamera3,
  KeysToMoveMap,
} from '~~/src/Common/Types/GameTypes'

export const doKeyPress = defineModelEffect(keyPressModel, (model) => {
  if (KeysToMoveMap[model.keyCode] !== undefined) {
    let newDirection = KeysToMoveMap[model.keyCode]

    if (model.keyCode === EKeyCode.W || model.keyCode === EKeyCode.S) {
      return
    }

    const game = gameInContext()
    const currentDirection = game.snake.direction
    newDirection = KeysToMoveCamera3[currentDirection][model.keyCode]

    game.moveSnake(newDirection)
    const renderService = renderServiceInContext()
    renderService.setLeadDirection(newDirection)
  }
})
