<template>
  <div>
    <RouterLink to="/simulator/snake/">Классическая змейка</RouterLink>
    <h1>Змейка 3Д</h1>
    <div class="row">
      <div>
        <div ref="canvasWrapper"></div>
      </div>
    </div>
    <KeyboardHint @pause="game.pause()" />
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { Euler, MathUtils, Vector3 } from 'three'
import { useService } from '~~/src/Common/Helpers/HService'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { SKeyboard } from '~~/src/Common/Services/SKeyboard'
import { EKeyCode, KeysToMoveMap } from '~~/src/Common/Types/GameTypes'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'
import KeyboardHint from '~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import { floor } from '~~/src/Common/Library/ThreeD/Entities/Floor'
import { camera3Check, camera3KeyMapper } from '~~/src/Common/Tools/Camera'
import {
  iterate,
  passNotNullishValue,
  thenIf,
} from '~~/src/Common/Tools/LogicFlow'
import {
  threeAudioPlay,
  threeEulerSetFrom,
  threeVectorSetFrom,
} from '~~/src/Common/Tools/Three'
import { baseSize } from '~~/src/Common/Constants/Three'
import { useSnakeCameraAnimation } from '~~/src/Snake/Modules/useSnakeCameraAnimation'
import { mul } from '~~/src/Common/Tools/Math'
import { ModelsPool } from '~~/src/Common/Models/ModelsPool'

const rserv = new RenderService()
const game = new WfSnake(15, 15)
const keyboard = useService<SKeyboard>('keyboard')

rserv.afterScene(async () => {
  rserv.scene.background = new THREE.Color('skyblue')
  const floorMesh = await floor(
    '/images/textures/grass2.jpg',
    [0, 0],
    [20, 20],
    2400,
    2400,
    100,
    1
  ).build()
  rserv.scene.add(floorMesh)
})

const startForwardPosition = new Vector3()
const startPosition = new Vector3()
const startRotation = new Euler()

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: EKeyCode) => {
  thenIf(KeysToMoveMap[key], () => {
    let newDirection = KeysToMoveMap[key]

    thenIf(camera3Check(rserv.cameraType), () => {
      newDirection = passNotNullishValue(
        camera3KeyMapper(game.snake.direction, key),
        newDirection
      )
    })

    game.moveSnake(newDirection)
    rserv.setLeadDirection(newDirection)
    threeVectorSetFrom(rserv.camera.position, startPosition)
    threeEulerSetFrom(rserv.camera.rotation, startRotation)
  })
})

const eatSound = () => rserv.sound('eated', '/sounds/eated.wav')
game.addEvent('afterEated', async () => {
  const sound = await eatSound()
  threeAudioPlay(sound)
})

const explodeSound = () => rserv.sound('explode', '/sounds/explode.wav')
game.addEvent('gameover', async () => {
  const sound = await explodeSound()
  threeAudioPlay(sound)
})

const toBaseSize = mul.bind(null, baseSize)

rserv.setLeadId('leadPoint')
game.afterNextFrame(() => {
  threeVectorSetFrom(rserv.camera.position, startForwardPosition)
  rserv.manageCube(
    game.target.id,
    toBaseSize(game.target.x),
    toBaseSize(-game.target.y),
    0x00aa00
  )

  rserv.manageCube(
    'leadPoint',
    toBaseSize(game.snake.leadPoint.x),
    toBaseSize(-game.snake.leadPoint.y),
    0xaa0000
  )

  rserv.setCameraPointId(game.snake.points[1].id)
  rserv.setLastUpdateTime(new Date().getTime())
  rserv.setGameSpeed(game.speed.value)
  game.snake.points.forEach((point: any) => {
    rserv.manageCube(
      point.id,
      toBaseSize(point.x),
      toBaseSize(-point.y),
      0x8888ff
    )
  })
})

const newRotation = new THREE.Euler(0, 0, 0)
const cameraRotation = ModelsPool.cameraRotation()

const { cameraPositionTick, camera } = useSnakeCameraAnimation()
rserv.setAfterAnimate((additional: number) => {
  camera.value = rserv.camera
  if (!camera3Check(rserv.cameraType)) {
    return
  }

  if (additional > 1) {
    additional = 1
  }

  const leadPoint = rserv.cubes[rserv.leadId]

  if (!leadPoint) {
    return
  }

  const { direction } = game.snake
  let { x, y } = leadPoint.position
  const {
    y: dy,
    x: dx,
    yMul,
    xMul,
    rotationDeg,
  } = cameraRotation.byDirection(direction)

  y += dy
  x += dx
  newRotation.set(
    MathUtils.degToRad(rotationDeg[0]),
    MathUtils.degToRad(rotationDeg[1]),
    MathUtils.degToRad(rotationDeg[2])
  )

  cameraPositionTick(
    additional,
    {
      x: x + toBaseSize(xMul),
      y: y + toBaseSize(yMul),
      z: 60,
    },
    newRotation,
    {
      x,
      y,
    }
  )
})

const canvasWrapper = ref()
onMounted(() => {
  rserv.render(canvasWrapper.value)

  Promise.all([eatSound(), explodeSound()]).then(() => {
    game.run()
  })

  const { width, height } = game.grid
  const borderColor = 0x2b241d

  iterate((i) => {
    rserv.createCube(`top${i}`, toBaseSize(i), baseSize, borderColor)
    rserv.createCube(
      `bottom${i}`,
      toBaseSize(i),
      toBaseSize(-height),
      borderColor
    )
  }, width)

  iterate((i) => {
    rserv.createCube(`left${i}`, -baseSize, toBaseSize(-i), borderColor)
    rserv.createCube(
      `right${i}`,
      toBaseSize(width),
      toBaseSize(-i),
      borderColor
    )
  }, height)

  setTimeout(() => {
    rserv.camera3()
  })
})
</script>
