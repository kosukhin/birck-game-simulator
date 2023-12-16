import { context } from '~~/app/systemModules/context/context'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

export const gameInContext = () =>
  context<WfSnake>({
    key: 'game',
  })

export const renderServiceInContext = () =>
  context<RenderService>({
    key: 'renderService',
  })
