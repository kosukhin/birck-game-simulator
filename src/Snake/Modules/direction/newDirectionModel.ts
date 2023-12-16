import { defineModelFactory } from './../../../Common/Library/I'
import { RenderService } from '~/src/Common/Library/ThreeD/Services/RenderService'
import { EMoveDirection } from '~/src/Common/Types/GameTypes'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

export type NewDirection = {
  direction: EMoveDirection
  renderService: RenderService
  game: WfSnake
}

export const newDirectionModel = defineModelFactory<NewDirection>()({})
