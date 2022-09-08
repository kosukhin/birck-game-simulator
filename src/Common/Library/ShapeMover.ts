import { MShape } from '~~/src/Common/Models/MShape'
import { MoveDirection } from '~~/src/Common/Types/GameTypes'

/**
 * Класс, который отвечает за перемещение фигуры в указанном направлении
 */
export class ShapeMover {
    /**
     * Сместить фигуру в направление
     * @param shape
     * @param direction
     */
    move(shape: MShape, direction: MoveDirection) {
        switch (direction) {
            case MoveDirection.up:
                shape.moveY(-1)
                break
            case MoveDirection.down:
                shape.moveY(1)
                break
            case MoveDirection.right:
                shape.moveX(1)
                break
            case MoveDirection.left:
                shape.moveX(-1)
                break
        }
    }
}
