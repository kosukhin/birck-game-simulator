import { PointsGroup } from '~~/app/appModules/frame'
import { PointWithColor } from '~~/src/Snake/Models'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

export function handleFrame(
  getGame: () => WfSnake,
  passGameSpeed: (speed: number) => void,
  doRenderFrame: (points: PointsGroup) => void
) {
  const theGame = getGame()
  passGameSpeed(theGame.speed.value)
  const pointsGroup: PointsGroup = {}
  pointsGroup[theGame.target.id] = new PointWithColor(
    0x00bb00,
    theGame.target.x,
    -theGame.target.y
  )
  pointsGroup.leadPoint = new PointWithColor(
    0xff2222,
    theGame.snake.leadPoint.x,
    -theGame.snake.leadPoint.y
  )
  theGame.snake.points.forEach((point: any) => {
    pointsGroup[point.id] = new PointWithColor(0xff5555, point.x, -point.y)
  })
  doRenderFrame(pointsGroup)
}
