import { EKeyCode } from '~/src/Common/Types/GameTypes'

export const keyboard = (cb: (key: EKeyCode) => void) => {
  window.addEventListener('keypress', (e) => {
    const key = e.code
    if (key === EKeyCode.SPC) {
      e.preventDefault()
    }
    // eslint-disable-next-line no-useless-call
    cb.apply(null, [key as EKeyCode])
  })
}
