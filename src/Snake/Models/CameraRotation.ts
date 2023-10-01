import { EMoveDirection } from '~~/src/Common/Types/GameTypes'

type RotationDto = {
  yMul: number
  xMul: number
  y: number
  x: number
  rotationDeg: [number, number, number]
}

export class CameraRotation {
  private k = 50
  private rules = {
    [EMoveDirection.down]: {
      yMul: -1,
      xMul: 0,
      y: this.k,
      x: 0,
      rotationDeg: [320, 0, 180],
    },
    [EMoveDirection.up]: {
      yMul: 1,
      xMul: 0,
      y: -this.k,
      x: 0,
      rotationDeg: [30, 0, 0],
    },
    [EMoveDirection.right]: {
      yMul: 0,
      xMul: 1,
      y: 0,
      x: -this.k,
      rotationDeg: [0, -30, 270],
    },
    [EMoveDirection.left]: {
      yMul: 0,
      xMul: -1,
      y: 0,
      x: this.k,
      rotationDeg: [0, 30, 90],
    },
  }

  byDirection(direction: EMoveDirection): RotationDto {
    return this.rules[direction] as RotationDto
  }
}
