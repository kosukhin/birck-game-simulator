import { Camera, Euler } from 'three'
import { baseSize } from '~~/src/Common/Constants/Three'
import { abs, add, mul, subtr } from '~~/src/Common/Tools/Math'
import { threeEulerSetFrom } from '~~/src/Common/Tools/Three'

type D3 = { x: number; y: number; z: number }

export function useSnakeCameraAnimation() {
  const camera = { value: null as null | Camera }

  function cameraPositionTick(
    additional: number,
    newPosition: D3,
    newRotation: D3,
    leadPoint: { x: number; y: number }
  ) {
    if (!camera.value) {
      return
    }

    let xsize = subtr(newPosition.x, camera.value.position.x)
    let ysize = subtr(newPosition.y, camera.value.position.y)

    if (abs(xsize) >= baseSize || abs(ysize) >= baseSize) {
      camera.value.position.x += mul(xsize, additional)
      camera.value.position.y += mul(ysize, additional)
    } else {
      xsize = subtr(newPosition.x, leadPoint.x)
      ysize = subtr(newPosition.y, leadPoint.y)
      camera.value.position.x = add(leadPoint.x, mul(xsize, additional))
      camera.value.position.y = add(leadPoint.y, mul(ysize, additional))
    }
    camera.value.position.z = newPosition.z

    threeEulerSetFrom(newRotation as Euler, camera.value.rotation)
  }

  return {
    camera,
    cameraPositionTick,
  }
}
