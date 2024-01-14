import {
  EKeyCode,
  EMoveDirection,
  KeysToMoveCamera3,
  KeysToMoveMap,
} from '~~/src/Common/Types/GameTypes'

export function handleKey(
  getKey: () => EKeyCode,
  getDirection: () => EMoveDirection,
  setDirection: (direction: EMoveDirection) => void
): void {
  const keyCode = getKey()

  if (keyCode === EKeyCode.W || keyCode === EKeyCode.S) {
    return
  }

  if (KeysToMoveMap[keyCode] === undefined) {
    return
  }

  const currentDirection = getDirection()
  const newDirection = KeysToMoveCamera3[currentDirection][keyCode]
  setDirection(newDirection)
}
