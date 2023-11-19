import { handleEffect } from '~/src/Common/Library/effect'
import { tickEffect } from '~/src/Snake/Effects/tickEffect'
import { Tick } from '~/src/Common/Library/ThreeD/Modules/tick/Tick'

handleEffect(tickEffect.id, (model: Tick) => {
  console.log(model)
})
