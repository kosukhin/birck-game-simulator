import { context } from '~~/app/systemModules/context/context'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { IGameWorkflow } from '~~/src/Common/Types/GameTypes'

export const gameInContext = <T = IGameWorkflow>() => context<T>('game')

export const renderServiceInContext = () =>
  context<RenderService>('renderService')
