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
import { Color, Euler, Vector3 } from 'three'
import KeyboardHint from '~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import { applyProcess, reactOn, takeInstance } from '~~/src/Common/Library/I'
import { FloorConfig } from '~~/src/Common/Library/ThreeD/Configs/FloorConfig'
import { SceneConfig } from '~~/src/Common/Library/ThreeD/Configs/SceneConfig'
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
import { useKeyboardProcedure } from '~~/src/Snake/Procedures/keyboard'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

const rserv = takeInstance(RenderService)
const game = takeInstance(WfSnake, 15, 15)
let sceneConfig = takeInstance(SceneConfig)

sceneConfig = sceneConfig.modify({
  background: takeInstance(Color, 'skyblue'),
  soundToEvents: [
    ['afterEated', '/sounds/eated.wav'],
    ['explode', '/sounds/explode.wav'],
    ['gameover', '/sounds/explode.wav'],
  ],
})

reactOn(rserv.afterScene.bind(rserv), async () => {
  const floor = takeInstance(FloorConfig, {
    texture,
  })
  const floorMesh = await floor(
    '/images/textures/grass2.jpg',
    [0, 0],
    [20, 20],
    2400,
    2400,
    100,
    1
  ).build()
  rserv.applySceneConfig(
    sceneConfig.modify({
      floor: floorMesh,
    })
  )
})

const startForwardPosition = takeInstance(Vector3)
const startPosition = takeInstance(Vector3)
const startRotation = takeInstance(Euler)

applyProcess(useKeyboardProcedure, rserv, game, startPosition, startRotation)

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
