import { NewDirection } from './newDirectionModel'
import {
  gameInContext,
  renderServiceInContext,
} from '~~/app/appModules/context'
import { Effect } from '~~/app/systemModules/base/effect'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

export const newDirection: Effect<typeof NewDirection> = (direction) => {
  const game = gameInContext<WfSnake>()
  game.moveSnake(direction)
  const renderService = renderServiceInContext()
  renderService.setLeadDirection(direction)
}
