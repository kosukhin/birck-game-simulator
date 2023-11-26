import { handleEffect } from '~/src/Common/Library/effect'
import { keyPressEffect } from '~/src/Snake/Effects/keyPressEffect'
import { useService } from '~/src/Common/Helpers/HService'
import { SKeyboard } from '~/src/Common/Services/SKeyboard'
import {
  EKeyCode,
  KeysToMoveCamera3,
  KeysToMoveMap,
} from '~/src/Common/Types/GameTypes'
import { KeyPress } from '~/src/Common/Library/ThreeD/Modules/keyPress/KeyPress'
import { WfSnake } from '~/src/Snake/Workflows/WfSnake'
import { RenderService } from '~/src/Common/Library/ThreeD/Services/RenderService'

const keyboard = useService<SKeyboard>('keyboard')

export const keyPressEffectHandler = () => {
  keyboard.clearSubscribers()
  handleEffect(
    keyPressEffect.id,
    (model: KeyPress, game: WfSnake, renderService: RenderService) => {
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
}
