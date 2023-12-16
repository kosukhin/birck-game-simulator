import { newDirectionModel } from './newDirectionModel'
import { defineModelEffect } from '~~/src/Common/Library/I'

export const newDirection = defineModelEffect(newDirectionModel, (model) => {
  model.game.moveSnake(model.direction)
  model.renderService.setLeadDirection(model.direction)
})
