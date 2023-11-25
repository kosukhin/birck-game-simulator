import { handleEffect } from '~/src/Common/Library/effect'
import { keyPressEffect } from '~/src/Snake/Effects/keyPressEffect'

export const keyPressEffectHandler = () =>
  handleEffect(keyPressEffect.id, (model: Keyframe) => {
    console.log(model)
  })
