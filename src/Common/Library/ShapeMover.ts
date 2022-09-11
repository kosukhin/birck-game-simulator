import { MShape } from '~~/src/Common/Models/MShape'
import { EMoveDirection } from '~~/src/Common/Types/GameTypes'

/**
 * Класс, который отвечает за перемещение фигуры в указанном направлении
 */
export class ShapeMover {
    /**
     * Сместить фигуру в направление
     * @param shape
     * @param direction
     */
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
