import {
  EKeyCode,
  EMoveDirection,
  KeysToMoveCamera3,
} from '~~/src/Common/Types/GameTypes'

export function camera3KeyMapper(
  currentDirection: EMoveDirection,
  key: string
) {
  if (key === EKeyCode.W || key === EKeyCode.S) {
    return
  }

  return KeysToMoveCamera3[currentDirection][key]
}
