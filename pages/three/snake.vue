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
import { Euler, Vector3 } from 'three'
import KeyboardHint from '~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import { reactOn, takeInstance } from '~~/src/Common/Library/I'
import { FloorModel } from '~~/src/Common/Library/ThreeD/Configs/FloorModel'
import { SceneModel } from '~/src/Common/Library/ThreeD/Configs/SceneModel'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { ModelsPool } from '~~/src/Common/Models/ModelsPool'
import { camera3Check } from '~~/src/Common/Tools/Camera'
import { toBaseSize } from '~~/src/Common/Tools/Cast'
import { thenIf } from '~~/src/Common/Tools/LogicFlow'
import { useSnakeCameraAnimation } from '~~/src/Snake/Modules/useSnakeCameraAnimation'
import {
  useBordersDrawProcedure,
  useDrawTickProcedure,
  useNextFrameDrawProcedure,
} from '~~/src/Snake/Procedures/draw'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'
import { useService } from '~/src/Common/Helpers/HService'
import { SKeyboard } from '~/src/Common/Services/SKeyboard'
import { CameraModel } from '~/src/Common/Library/ThreeD/Configs/CameraModel'
import { KeysToMoveMap } from '~/src/Common/Types/GameTypes'

const rserv = takeInstance(RenderService)
const game = takeInstance(WfSnake, 15, 15)
const floor = takeInstance(FloorModel, {
  texture: '/images/textures/grass2.jpg',
  offset: [0, 0],
  repeat: [20, 20],
  width: 2400,
  height: 2400,
  widthSegments: 100,
  heightSegments: 1,
})
const scene = takeInstance(SceneModel, {
  background: 'skyblue',
  soundToEvents: [
    ['afterEated', '/sounds/eated.wav'],
    ['explode', '/sounds/explode.wav'],
    ['gameover', '/sounds/explode.wav'],
  ],
  floor,
})

rserv.applySceneConfig(scene)

const startForwardPosition = takeInstance(Vector3)
const startPosition = takeInstance(Vector3)
const startRotation = takeInstance(Euler)

const keyboard = useService<SKeyboard>('keyboard')
const cameraModel = takeInstance(CameraModel)
reactOn(keyboard.registerSubscriber.bind(keyboard), (keyCode) => {
  thenIf(KeysToMoveMap[keyCode], () => {
    cameraModel.modify({
      directionKeyCode: keyCode,
      cameraPosition: startPosition,
      cameraRotation: startRotation,
    })
  })
})

rserv.setLeadId('leadPoint')
game.afterNextFrame(() => {
  useNextFrameDrawProcedure(rserv, game, startForwardPosition)
})

const cameraRotation = ModelsPool.cameraRotation()

const { cameraPositionTick, camera } = useSnakeCameraAnimation()
rserv.setAfterAnimate((additional: number) => {
  camera.value = rserv.camera

  thenIf(camera3Check(rserv.cameraType), () => {
    additional = additional > 1 ? 1 : additional
    const tickResult: any = useDrawTickProcedure(rserv, game, cameraRotation)

    thenIf(!!tickResult, () => {
      cameraPositionTick(
        additional,
        {
          x: tickResult.x + toBaseSize(tickResult.xMul),
          y: tickResult.y + toBaseSize(tickResult.yMul),
          z: 60,
        },
        tickResult.newRotation,
        {
          x: tickResult.x,
          y: tickResult.y,
        }
      )
    })
  })
})

const canvasWrapper = ref()
onMounted(() => {
  rserv.render(canvasWrapper.value)
  game.run()
  useBordersDrawProcedure(rserv, game)

  setTimeout(() => {
    rserv.camera3()
  })
})
</script>
