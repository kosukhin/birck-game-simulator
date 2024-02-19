import { MShape } from '~~/src/common/models/MShape'
import { EMoveDirection } from '~~/src/common/types/GameTypes'

export class ShapeMover {
  move(shape: MShape, direction: EMoveDirection) {
    switch (direction) {
    case EMoveDirection.up:
      shape.moveY(-1)
      break
    case EMoveDirection.down:
      shape.moveY(1)
      break
    case EMoveDirection.right:
      shape.moveX(1)
      break
    case EMoveDirection.left:
      shape.moveX(-1)
      break
    }
  }
}
