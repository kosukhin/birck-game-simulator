import { EKeyCode } from '~/src/Common/Types/GameTypes'
import { useService } from '~/src/Common/Helpers/HService'
import { SKeyboard } from '~/src/Common/Services/SKeyboard'

const keyboard = useService<SKeyboard>('keyboard')
export function oOnNewKey(cb: (keyCode: EKeyCode) => void) {
  keyboard.registerSubscriber(cb)
}
