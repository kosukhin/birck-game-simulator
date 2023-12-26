import { context } from '~~/app/systemModules/context/context'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'

export const gameInContext = <T>() =>
  context<T>({
    key: 'game',
  })

export const renderServiceInContext = () =>
  context<RenderService>({
    key: 'renderService',
  })
