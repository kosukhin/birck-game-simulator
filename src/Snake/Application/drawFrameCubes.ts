import { Cube, SnakeGame } from '~/src/Snake/Models'
import { takeInstance } from '~/src/Common/Library/I'
import { leadPointId, targetPointId } from '~/src/Snake/Constants/game'
import {
  leadPointColor,
  snakeTailColor,
  targetColor,
} from '~/src/Snake/Constants/colors'

export function drawFrameCubes(snakeGame: SnakeGame) {
  const tailCubes = snakeGame.tail.points.map((point) => {
    return takeInstance(Cube, point.id, snakeTailColor, point.x, point.y)
  })

  return {
    target: takeInstance(
      Cube,
      targetPointId,
      targetColor,
      snakeGame.target.x,
      snakeGame.target.y
    ),
    lead: takeInstance(
      Cube,
      leadPointId,
      leadPointColor,
      snakeGame.lead.x,
      snakeGame.lead.y
    ),
    tail: tailCubes,
  }
}
