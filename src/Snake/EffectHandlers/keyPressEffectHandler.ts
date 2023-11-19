import { handleEffect } from '~/src/Common/Library/effect'
import { keyPressEffect } from '~/src/Snake/Effects/keyPressEffect'

handleEffect(keyPressEffect.id, (model: Keyframe) => {
  console.log(model)
})
