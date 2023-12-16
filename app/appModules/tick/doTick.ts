import { MathUtils } from 'three'
import { renderServiceInContext } from '~~/app/appModules/context'
import { tickModel } from '~~/app/appModules/tick/tickModel'
import { baseSize } from '~~/src/Common/Constants/Three'
import { defineModelEffect } from '~~/src/Common/Library/I'
import { EMoveDirection } from '~~/src/Common/Types/GameTypes'

type D3 = { x: number; y: number; z: number }
const newRotation: D3 = { x: 0, y: 0, z: 0 }
const k = 50

export const doTick = defineModelEffect(tickModel, (model) => {
  let additional = model.additional

  if (additional > 1) {
    additional = 1
  }

  let xMul = 1
  let yMul = 1
  const direction = model.direction
  const leadPoint = model.leadPoint
  let x = leadPoint.x * baseSize
  let y = leadPoint.y * baseSize

  if (direction === EMoveDirection.down) {
    yMul = 1
    xMul = 0
    y -= k
    newRotation.x = MathUtils.degToRad(320)
    newRotation.y = MathUtils.degToRad(0)
    newRotation.z = MathUtils.degToRad(180)
  }

  if (direction === EMoveDirection.up) {
    yMul = -1
    xMul = 0
    y += k
    newRotation.x = MathUtils.degToRad(30)
    newRotation.y = MathUtils.degToRad(0)
    newRotation.z = MathUtils.degToRad(0)
  }

  if (direction === EMoveDirection.right) {
    yMul = 0
    xMul = -1
    x -= k
    newRotation.x = MathUtils.degToRad(0)
    newRotation.y = MathUtils.degToRad(-30)
    newRotation.z = MathUtils.degToRad(270)
  }

  if (direction === EMoveDirection.left) {
    yMul = 0
    xMul = 1
    x += k
    newRotation.x = MathUtils.degToRad(0)
    newRotation.y = MathUtils.degToRad(30)
    newRotation.z = MathUtils.degToRad(90)
  }

  calcAnimatePosition(
    {
      x: x - baseSize * xMul * additional,
      y: -y - baseSize * yMul * additional,
      z: 60,
    },
    newRotation
  )
})

function calcAnimatePosition(newPosition: D3, newRotation: D3) {
  const renderService = renderServiceInContext()
  renderService.camera.position.x = newPosition.x
  renderService.camera.position.y = newPosition.y
  renderService.camera.position.z = newPosition.z

  renderService.camera.rotation.x = newRotation.x
  renderService.camera.rotation.y = newRotation.y
  renderService.camera.rotation.z = newRotation.z
}
