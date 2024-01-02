import {
  gameInContext,
  renderServiceInContext,
} from '~~/app/appModules/context'
import { NewDirection } from '~~/src/Snake/Modules/direction/newDirectionModel'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

export const newDirection: (
  ...p: ConstructorParameters<typeof NewDirection>
) => void = (direction) => {
  const game = gameInContext<WfSnake>()
  game.moveSnake(direction)
  const renderService = renderServiceInContext()
  renderService.setLeadDirection(direction)
}
