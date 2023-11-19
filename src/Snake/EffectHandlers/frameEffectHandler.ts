import { Frame } from 'jest-message-util'
import { handleEffect } from '~/src/Common/Library/effect'
import { frameEffect } from '~/src/Snake/Effects/frameEffect'

handleEffect(frameEffect.id, (model: Frame) => {
  console.log(model)
})
