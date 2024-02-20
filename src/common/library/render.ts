import { MathUtils } from 'three'
import { RenderService } from '~/src/common/library/ThreeD/Services/RenderService'
import { Block } from '~~/src/common/types/Block'
import { baseSize } from '~~/src/common/library/constants'
import { EMoveDirection } from '~~/src/common/types/GameTypes'
import { FType } from '~/src/common/utils/system'
import { GameGrid } from '~/src/common/types/Game'

export function onTick(rserv: RenderService, cb: (additional: number) => void) {
  rserv.setAfterAnimate(cb)
}

type D3 = { x: number; y: number; z: number }
const newRotation: D3 = { x: 0, y: 0, z: 0 }
const k = 50

export function renderTick(
  getAngles: FType<{ x: number; y: number; z: number }>,
  getGameGrid: FType<GameGrid>,
  getRenderService: FType<RenderService>,
  direction: FType<EMoveDirection>,
  cameraLookTo: FType<Block>,
  cameraHeight: FType<number>,
  initAdditional: number
) {
  let additional = initAdditional

  if (additional > 1) {
    additional = 1
  }

  const gameGrid = getGameGrid()
  const lookTo = cameraLookTo() || {
    x: Math.round(gameGrid.gameSize.width / 2),
    y: Math.round(gameGrid.gameSize.height / 2),
  }

  let xMul = 1
  let yMul = 1
  let x = lookTo.x * baseSize
  let y = lookTo.y * baseSize

  if (direction() === EMoveDirection.down) {
    yMul = 1
    xMul = 0
    y -= k
    newRotation.x = MathUtils.degToRad(320)
    newRotation.y = MathUtils.degToRad(0)
    newRotation.z = MathUtils.degToRad(180)
  }

  if (direction() === EMoveDirection.up) {
    yMul = -1
    xMul = 0
    y += k
    newRotation.x = MathUtils.degToRad(30)
    newRotation.y = MathUtils.degToRad(0)
    newRotation.z = MathUtils.degToRad(0)
  }

  if (direction() === EMoveDirection.right) {
    yMul = 0
    xMul = -1
    x -= k
    newRotation.x = MathUtils.degToRad(0)
    newRotation.y = MathUtils.degToRad(-30)
    newRotation.z = MathUtils.degToRad(270)
  }

  if (direction() === EMoveDirection.left) {
    yMul = 0
    xMul = 1
    x += k
    newRotation.x = MathUtils.degToRad(0)
    newRotation.y = MathUtils.degToRad(30)
    newRotation.z = MathUtils.degToRad(90)
  }

  const angles = getAngles()
  if (angles) {
    newRotation.x = MathUtils.degToRad(angles.x)
    newRotation.y = MathUtils.degToRad(angles.y)
    newRotation.z = MathUtils.degToRad(angles.z)
  }

  const newPosition = {
    x: x - baseSize * xMul * additional,
    y: -y - baseSize * yMul * additional,
    z: cameraHeight(),
  }
  const renderService = getRenderService()
  renderService.camera.position.x = newPosition.x
  renderService.camera.position.y = newPosition.y
  renderService.camera.position.z = newPosition.z

  renderService.camera.rotation.x = newRotation.x
  renderService.camera.rotation.y = newRotation.y
  renderService.camera.rotation.z = newRotation.z
}
