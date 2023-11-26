import { MathUtils } from 'three'
import { handleEffect } from '~/src/Common/Library/effect'
import { tickEffect } from '~/src/Snake/Effects/tickEffect'
import { Tick } from '~/src/Common/Library/ThreeD/Modules/tick/Tick'
import { RenderService } from '~/src/Common/Library/ThreeD/Services/RenderService'
import { EMoveDirection } from '~/src/Common/Types/GameTypes'

type D3 = { x: number; y: number; z: number }
const newRotation: D3 = { x: 0, y: 0, z: 0 }

const k = 50
export const tickEffectHandler = () =>
  handleEffect(tickEffect.id, (model: Tick, renderService: RenderService) => {
    console.log(model)
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
      additional,
      {
        x: x + baseSize * xMul,
        y: -y + baseSize * yMul,
        z: 60,
      },
      newRotation,
      {
        x,
        y,
      },
      renderService
    )
  })

const baseSize = 10

function calcAnimatePosition(
  additional: number,
  newPosition: D3,
  newRotation: D3,
  leadPoint: { x: number; y: number },
  renderService: RenderService
) {
  let xsize = newPosition.x - renderService.camera.position.x
  let ysize = newPosition.y - renderService.camera.position.y

  if (Math.abs(xsize) >= baseSize || Math.abs(ysize) >= baseSize) {
    renderService.camera.position.x += xsize * additional
    renderService.camera.position.y += ysize * additional
    renderService.camera.position.z = newPosition.z
  } else {
    xsize = newPosition.x - leadPoint.x
    ysize = newPosition.y - leadPoint.y
    renderService.camera.position.x = leadPoint.x + xsize * additional
    renderService.camera.position.y = leadPoint.y + ysize * additional
    renderService.camera.position.z = newPosition.z
  }

  renderService.camera.rotation.x = newRotation.x
  renderService.camera.rotation.y = newRotation.y
  renderService.camera.rotation.z = newRotation.z
}
