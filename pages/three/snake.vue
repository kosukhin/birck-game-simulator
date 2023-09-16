<template>
  <div>
    <RouterLink to="/simulator/snake/">Классическая змейка</RouterLink>
    <h1>Змейка 3Д</h1>
    <div class="row">
      <div>
        <div ref="canvasWrapper" :class="'type-' + cameraType"></div>
      </div>
    </div>
    <div>
      <el-button @click="onChangeCamera('camera1')">Камера 1</el-button>
      <el-button @click="onChangeCamera('camera2')">Камера 2</el-button>
      <el-button @click="onChangeCamera('camera3')">Камера 3</el-button>
    </div>
    <div>
      <el-button @click="game.pause()">Пауза</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { Euler, MathUtils, Vector3 } from 'three'
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
import CameraControls from '~/pages/three/CameraControls.vue'

const cameraType = ref('camera1')
const direction = ref(EMoveDirection.right)
const rserv = new RenderService()
const canvasWrapper = ref()

const game = new WfSnake(15, 15)
const keyboard = useService<SKeyboard>('keyboard')

rserv.afterScene(async () => {
  rserv.scene.background = new THREE.Color('skyblue')
  const textureLoader = new THREE.TextureLoader()
  const texture = await textureLoader.loadAsync('/images/textures/grass2.jpg')
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0, 0)
  texture.repeat.set(20, 20)
  const floorGeometry = new THREE.PlaneGeometry(2400, 2400, 100, 1)
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: texture,
  })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.position.set(100, -100, -4)
  rserv.scene.add(floor)
})

const startForwardPosition = new Vector3()
const startPosition = new Vector3()
const startRotation = new Euler()

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
    startPosition.set(
      rserv.camera.position.x,
      rserv.camera.position.y,
      rserv.camera.position.z
    )
    startRotation.set(
      rserv.camera.rotation.x,
      rserv.camera.rotation.y,
      rserv.camera.rotation.z
    )
  }
})

type D3 = { x: number; y: number; z: number }

function calcAnimatePosition(
  additional: number,
  newPosition: D3,
  newRotation: D3,
  leadPoint: { x: number; y: number }
) {
  let xsize = newPosition.x - rserv.camera.position.x
  let ysize = newPosition.y - rserv.camera.position.y

  if (Math.abs(xsize) >= baseSize || Math.abs(ysize) >= baseSize) {
    rserv.camera.position.x += xsize * additional
    rserv.camera.position.y += ysize * additional
    rserv.camera.position.z = newPosition.z
  } else {
    xsize = newPosition.x - leadPoint.x
    ysize = newPosition.y - leadPoint.y
    rserv.camera.position.x = leadPoint.x + xsize * additional
    rserv.camera.position.y = leadPoint.y + ysize * additional
    rserv.camera.position.z = newPosition.z
  }

  rserv.camera.rotation.x = newRotation.x
  rserv.camera.rotation.y = newRotation.y
  rserv.camera.rotation.z = newRotation.z
}

const eatSound = () => rserv.sound('eated', '/sounds/eated.wav')
const explodeSound = () => rserv.sound('explode', '/sounds/explode.wav')

game.addEvent('afterEated', async () => {
  const sound = await eatSound()
  sound.play()
  setTimeout(() => {
    sound.stop()
  }, 1500)
})

game.addEvent('gameover', async () => {
  const sound = await explodeSound()
  sound.play()
  setTimeout(() => {
    sound.stop()
  }, 1500)
})

const baseSize = 10
rserv.setLeadId('leadPoint')
game.afterNextFrame(() => {
  startForwardPosition.set(
    rserv.camera.position.x,
    rserv.camera.position.y,
    rserv.camera.position.z
  )
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

const cameraControls = reactive({
  rx: 0,
  ry: 0,
  rz: 0,
})
const newRotation = new THREE.Euler(0, 0, 0)

function setRotationOrDefault(key: string, defVal: number) {
  // @ts-ignore
  return cameraControls[key] === 0
    ? defVal
    : MathUtils.degToRad(Number(cameraControls[key]))
}

rserv.setAfterAnimate((additional: number) => {
  if (rserv.cameraType !== 3) {
    return
  }

  if (additional > 1) {
    additional = 1
  }

  let xMul = 1
  let yMul = 1
  const direction = game.snake.direction
  const leadPoint = rserv.cubes[rserv.leadId]
  let x = leadPoint.position.x
  let y = leadPoint.position.y

  newRotation.x = setRotationOrDefault('rx', newRotation.x)
  newRotation.y = setRotationOrDefault('ry', newRotation.y)
  newRotation.z = setRotationOrDefault('rz', newRotation.z)

  if (direction === EMoveDirection.down) {
    yMul = -1
    xMul = 0
    y += k
    newRotation.x = setRotationOrDefault('rx', MathUtils.degToRad(320))
    newRotation.y = setRotationOrDefault('ry', MathUtils.degToRad(0))
    newRotation.z = setRotationOrDefault('rz', MathUtils.degToRad(180))
  }

  if (direction === EMoveDirection.up) {
    xMul = 0
    y -= k
    newRotation.x = setRotationOrDefault('rx', MathUtils.degToRad(30))
    newRotation.y = setRotationOrDefault('ry', MathUtils.degToRad(0))
    newRotation.z = setRotationOrDefault('rz', MathUtils.degToRad(0))
  }

  if (direction === EMoveDirection.right) {
    yMul = 0
    xMul = 1
    x -= k
    newRotation.x = setRotationOrDefault('rx', MathUtils.degToRad(0))
    newRotation.y = setRotationOrDefault('ry', MathUtils.degToRad(-30))
    newRotation.z = setRotationOrDefault('rz', MathUtils.degToRad(270))
  }

  if (direction === EMoveDirection.left) {
    yMul = 0
    xMul = -1
    x += k
    newRotation.x = setRotationOrDefault('rx', MathUtils.degToRad(0))
    newRotation.y = setRotationOrDefault('ry', MathUtils.degToRad(30))
    newRotation.z = setRotationOrDefault('rz', MathUtils.degToRad(90))
  }

  calcAnimatePosition(
    additional,
    {
      x: x + baseSize * xMul,
      y: y + baseSize * yMul,
      z: 60,
    },
    {
      x: newRotation.x,
      y: newRotation.y,
      z: newRotation.z,
    },
    {
      x,
      y,
    }
  )
})

onMounted(() => {
  rserv.render(canvasWrapper.value)

  Promise.all([eatSound(), explodeSound()]).then(() => {
    game.run()
  })

  const width = game.grid.width
  const height = game.grid.height
  const common = 0x2b241d
  const red = common
  const green = common
  const blue = common
  const white = common

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

<style lang="scss">
.row {
  display: flex;
  flex-direction: row;
}
</style>
