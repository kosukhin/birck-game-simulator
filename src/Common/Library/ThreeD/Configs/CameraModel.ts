import { Euler, Vector3 } from 'three'
import { BaseModel } from '~/src/Common/Config/Model'
import { takeInstance } from '~~/src/Common/Library/I'
import { EKeyCode, EMoveDirection } from '~/src/Common/Types/GameTypes'

interface CameraFields {
  directionKeyCode: EKeyCode
  newDirection: EMoveDirection
  cameraPosition: Vector3
  cameraRotation: Euler
}

export class CameraModel extends BaseModel<CameraFields> {
  newInstance(newFields: CameraFields): this {
    return takeInstance(CameraModel, newFields) as this
  }
}
