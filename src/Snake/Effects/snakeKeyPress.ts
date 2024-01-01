import {
  gameInContext,
  renderServiceInContext,
} from '~~/app/appModules/context'
import { KeyPress } from '~~/app/appModules/keyPress/keyPressModel'
import {
  EKeyCode,
  KeysToMoveCamera3,
  KeysToMoveMap,
} from '~~/src/Common/Types/GameTypes'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

export const snakeKeyPress = (
  ...props: ConstructorParameters<typeof KeyPress>
) => {
  const [keyCode] = props
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
