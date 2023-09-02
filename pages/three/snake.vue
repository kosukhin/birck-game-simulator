<template>
  <div>
    <RouterLink to="/simulator/snake/">Классическая змейка</RouterLink>
    <h1>Змейка 3Д</h1>
    <div ref="canvasWrapper" :class="'type-' + cameraType"></div>
    <el-button @click="onChangeCamera('camera1')">Камера 1</el-button>
    <el-button @click="onChangeCamera('camera2')">Камера 2</el-button>
    <el-button @click="onChangeCamera('camera3')">Камера 3</el-button>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { MathUtils } from 'three'
import { useService } from '~~/src/Common/Helpers/HService'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { SKeyboard } from '~~/src/Common/Services/SKeyboard'
import {
  EMoveDirection,
  EKeyCode,
  KeysToMoveMap,
  KeysToMoveCamera3,
} from '~~/src/Common/Types/GameTypes'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

const cameraType = ref('camera1')
const direction = ref(EMoveDirection.right)
const rserv = new RenderService()
const canvasWrapper = ref()

const game = new WfSnake()
const keyboard = useService<SKeyboard>('keyboard')

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: EKeyCode) => {
  if (KeysToMoveMap[key] !== undefined) {
    let newDirection = KeysToMoveMap[key]

    if (cameraType.value === 'camera3') {
      if (key === EKeyCode.W || key === EKeyCode.S) {
        return
      }

      const currentDirection = game.snake.direction
      newDirection = KeysToMoveCamera3[currentDirection][key]
    }

    direction.value = newDirection
    game.moveSnake(newDirection)
    rserv.setLeadDirection(newDirection)
  }
})

game.run()
const baseSize = 10
rserv.setLeadId('leadPoint')
game.afterNextFrame(() => {
  rserv.manageCube(
    game.target.id,
    game.target.x * baseSize,
    -game.target.y * baseSize,
    0x00aa00
  )

  rserv.manageCube(
    'leadPoint',
    game.snake.leadPoint.x * baseSize,
    -game.snake.leadPoint.y * baseSize,
    0xaa0000
  )

  rserv.setCameraPointId(game.snake.points[1].id)
  rserv.setLastUpdateTime(new Date().getTime())
  rserv.setGameSpeed(game.speed.value)
  game.snake.points.forEach((point: any) => {
    rserv.manageCube(
      point.id,
      point.x * baseSize,
      -point.y * baseSize,
      0x8888ff
    )
  })
})

const k = 50

rserv.setAfterAnimate((additional: number) => {
  if (rserv.cameraType !== 3) {
    return
  }

  if (additional > 1) {
    return
  }

  let xMul = 1
  let yMul = 1
  let rotateX = 0
  let rotateY = 0
  let rotateZ = 0
  const direction = game.snake.direction
  const leadPoint = rserv.cubes[rserv.leadId]
  let x = leadPoint.position.x
  let y = leadPoint.position.y

  if (direction === EMoveDirection.down) {
    yMul = -1
    xMul = 0
    y += k
    rotateX = -45
    rotateZ = 180
  }

  if (direction === EMoveDirection.up) {
    xMul = 0
    y -= k
    rotateX = 45
  }

  if (direction === EMoveDirection.right) {
    yMul = 0
    xMul = 1
    x -= k
    rotateY = -45
    rotateZ = -90
  }

  if (direction === EMoveDirection.left) {
    yMul = 0
    xMul = -1
    x += k
    rotateY = 45
    rotateZ = 90
  }

  const temp = new THREE.Vector3()
  rserv.camera.position.lerp(temp, 0.7)
  rserv.camera.position.z = 60
  rserv.camera.position.x = x + additional * baseSize * xMul
  rserv.camera.position.y = y + additional * baseSize * yMul
  const pointVector = new THREE.Vector3()
  pointVector.x += leadPoint.position.x + additional * baseSize * xMul
  pointVector.y += leadPoint.position.y + additional * baseSize * yMul
  rserv.camera.lookAt(pointVector)
  rserv.camera.rotation.x = MathUtils.degToRad(rotateX)
  rserv.camera.rotation.y = MathUtils.degToRad(rotateY)
  rserv.camera.rotation.z = MathUtils.degToRad(rotateZ)
})

onMounted(() => {
  rserv.render(canvasWrapper.value)
  const width = game.grid.width
  const height = game.grid.height
  const red = 0xff0000
  const green = 0x00ff00
  const blue = 0x0000ff
  const white = 0xffffff

  for (let i = 0; i < width; i++) {
    rserv.createCube('top' + i, i * baseSize, 1 * baseSize, red)
    rserv.createCube('bottom' + i, i * baseSize, -height * baseSize, white)
  }

  for (let i = 0; i < height; i++) {
    rserv.createCube('left' + i, -1 * baseSize, -i * baseSize, green)
    rserv.createCube('right' + i, width * baseSize, -i * baseSize, blue)
  }

  setTimeout(() => {
    onChangeCamera('camera3')
  })
})

const onChangeCamera = (type: string) => {
  cameraType.value = type
  if (type in rserv) {
    ;(rserv as any)[type]()
  }
}
</script>
