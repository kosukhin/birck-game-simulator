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
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'
import KeyboardHint from '~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import { camera3Check } from '~~/src/Common/Tools/Camera'
import { useSnakeCameraAnimation } from '~~/src/Snake/Modules/useSnakeCameraAnimation'
import { ModelsPool } from '~~/src/Common/Models/ModelsPool'
import { useSceneInitProcedure } from '~~/src/Snake/Procedures/scene'
import { useKeyboardProcedure } from '~~/src/Snake/Procedures/keyboard'
import { useSoundBindProcedure } from '~~/src/Snake/Procedures/sound'
import { toBaseSize } from '~~/src/Common/Tools/Cast'
import {
  useBordersDrawProcedure,
  useDrawTickProcedure,
  useNextFrameDrawProcedure,
} from '~~/src/Snake/Procedures/draw'
import { thenIf } from '~~/src/Common/Tools/LogicFlow'
import { I } from '~~/src/Common/Library/I'

const rserv = I.getInstance(RenderService)
const game = I.getInstance(WfSnake, 15, 15)

I.reactOn(rserv.afterScene.bind(rserv), () => {
  I.applyProcess(useSceneInitProcedure, rserv)
  I.applyProcess(useSoundBindProcedure, rserv, game)
})

const startForwardPosition = I.getInstance(Vector3)
const startPosition = I.getInstance(Vector3)
const startRotation = I.getInstance(Euler)

useKeyboardProcedure(rserv, game, startPosition, startRotation)

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
