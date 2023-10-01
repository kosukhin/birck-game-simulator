import { Euler, Vector3 } from 'three'
import { useService } from '~~/src/Common/Helpers/HService'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { SKeyboard } from '~~/src/Common/Services/SKeyboard'
import { camera3Check, camera3KeyMapper } from '~~/src/Common/Tools/Camera'
import { passNotNullishValue, thenIf } from '~~/src/Common/Tools/LogicFlow'
import {
  threeEulerSetFrom,
  threeVectorSetFrom,
} from '~~/src/Common/Tools/Three'
import { EKeyCode, KeysToMoveMap } from '~~/src/Common/Types/GameTypes'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

export function useKeyboardProcedure(
  rserv: RenderService,
  game: WfSnake,
  startPosition: Vector3,
  startRotation: Euler
) {
  const keyboard = useService<SKeyboard>('keyboard')

  keyboard.clearSubscribers()
  keyboard.registerSubscriber((key: EKeyCode) => {
    thenIf(KeysToMoveMap[key], () => {
      let newDirection = KeysToMoveMap[key]

      thenIf(camera3Check(rserv.cameraType), () => {
        newDirection = passNotNullishValue(
          camera3KeyMapper(game.snake.direction, key),
          newDirection
        )
      })

      game.moveSnake(newDirection)
      rserv.setLeadDirection(newDirection)
      threeVectorSetFrom(rserv.camera.position, startPosition)
      threeEulerSetFrom(rserv.camera.rotation, startRotation)
    })
  })
}
