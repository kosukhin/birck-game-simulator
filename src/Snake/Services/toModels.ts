import { Point, PointWithId, SnakeGame, SnakeTail } from '~/src/Snake/Models'
import { WfSnake } from '~/src/Snake/Workflows/WfSnake'
import { takeInstance } from '~/src/Common/Library/I'
import { toBaseSize } from '~/src/Common/Tools/Cast'

export function oCreateSnakeGameModel(game: WfSnake): SnakeGame {
  const tailPoints = game.snake.points.map((point: any) => {
    return takeInstance(
      PointWithId,
      point.id,
      toBaseSize(point.x),
      toBaseSize(-point.y)
    )
  })

  return takeInstance(
    SnakeGame,
    takeInstance(Point, toBaseSize(game.target.x), toBaseSize(-game.target.y)),
    takeInstance(
      Point,
      toBaseSize(game.snake.leadPoint.x),
      toBaseSize(-game.snake.leadPoint.y)
    ),
    takeInstance(SnakeTail, tailPoints)
  )
}
