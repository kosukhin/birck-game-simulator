import { Point, SnakeTail } from '~/src/Snake/Models'
import { WfSnake } from '~/src/Snake/Workflows/WfSnake'
import { takeInstance } from '~/src/Common/Library/I'
import { toBaseSize } from '~/src/Common/Tools/Cast'

export function createGamePoints(game: WfSnake) {
  const tailPoints = game.snake.points.map((point: any) => {
    return takeInstance(Point, toBaseSize(point.x), toBaseSize(-point.y))
  })

  return {
    target: takeInstance(
      Point,
      toBaseSize(game.target.x),
      toBaseSize(-game.target.y)
    ),
    snakeLead: takeInstance(
      Point,
      toBaseSize(game.snake.leadPoint.x),
      toBaseSize(-game.snake.leadPoint.y)
    ),
    snakeTail: takeInstance(SnakeTail, tailPoints),
  }
}
