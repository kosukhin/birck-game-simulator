import { defineModelEffect } from '~~/src/Common/Library/I'
import {
  KeyPress,
  keyPressModel,
} from '~~/src/Common/Library/ThreeD/Modules/keyPress/KeyPress'
import {
  EKeyCode,
  KeysToMoveCamera3,
  KeysToMoveMap,
} from '~~/src/Common/Types/GameTypes'

export const snakeKeyPress = defineModelEffect<typeof keyPressModel>(
  keyPressModel,
  async (model) => {
    if (KeysToMoveMap[model.keyCode] !== undefined) {
      let newDirection = KeysToMoveMap[model.keyCode]

      if (model.keyCode === EKeyCode.W || model.keyCode === EKeyCode.S) {
        return
      }

      const currentDirection = game.snake.direction
      newDirection = KeysToMoveCamera3[currentDirection][model.keyCode]

      game.moveSnake(newDirection)
      renderService.setLeadDirection(newDirection)
    }
  }
)
