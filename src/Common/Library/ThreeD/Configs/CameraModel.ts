import { Euler, Vector3 } from 'three'
import { BaseModel } from '~/src/Common/Config/Model'
import { EKeyCode, EMoveDirection } from '~/src/Common/Types/GameTypes'

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
}
