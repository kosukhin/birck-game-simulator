import { Euler, Vector3 } from 'three'
import { EKeyCode, EMoveDirection } from '~~/src/common/types/GameTypes'
import { BaseModel } from '~/src/Base/BaseModel'

export class CameraModel extends BaseModel {
  constructor(
    readonly directionKeyCode: EKeyCode,
    readonly direction: EMoveDirection,
    readonly cameraPosition: Vector3,
    readonly cameraRotation: Euler,
    readonly cameraType: number
  ) {
    super()
  }

  internalName(): string {
    return 'Camera'
  }
}
