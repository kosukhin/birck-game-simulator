import { EMoveDirection } from '~~/src/Common/Types/GameTypes'
import { Point } from '~~/src/Snake/Models'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

export function handleTick(
  getGame: () => WfSnake,
  getAnimationOffset: () => number,
  doRenderTick: (
    animationOffset: number,
    direction: EMoveDirection,
    leadPoint: Point
  ) => void
) {
  const theGame = getGame()
  const animationOffset = getAnimationOffset()
  doRenderTick(
    animationOffset,
    theGame.snake.direction,
    new Point(theGame.snake.leadPoint.x, theGame.snake.leadPoint.y)
  )
}
