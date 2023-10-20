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
import { useService } from '~/src/Common/Helpers/HService'
import { CameraModel } from '~/src/Common/Library/ThreeD/Configs/CameraModel'
import { SceneModel } from '~/src/Common/Library/ThreeD/Configs/SceneModel'
import { SKeyboard } from '~/src/Common/Services/SKeyboard'
import { EKeyCode, KeysToMoveMap } from '~/src/Common/Types/GameTypes'
import { takeInstance } from '~~/src/Common/Library/I'
import { FloorModel } from '~~/src/Common/Library/ThreeD/Configs/FloorModel'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { ModelsPool } from '~~/src/Common/Models/ModelsPool'
import { camera3Check } from '~~/src/Common/Tools/Camera'
import { toBaseSize } from '~~/src/Common/Tools/Cast'
import { thenIf } from '~~/src/Common/Tools/LogicFlow'
import { calculateDirection } from '~~/src/Snake/Application/calculateDirection'
import { useSnakeCameraAnimation } from '~~/src/Snake/Modules/useSnakeCameraAnimation'
import {
  useBordersDrawProcedure,
  useDrawTickProcedure,
  useNextFrameDrawProcedure,
} from '~~/src/Snake/Procedures/draw'
import {
  applyCameraModelToGame,
  applyCameraModelToRenderService,
} from '~~/src/Snake/Services/applyCameraModel'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'
import { leadPointId } from '~/src/Snake/Constants/game'
import { floorTexture } from '~/src/Snake/Constants/textures'
import { floorSizes } from '~/src/Snake/Constants/sizes'
import { sceneBackgroundColor } from '~/src/Snake/Constants/colors'
import { gameSounds } from '~/src/Snake/Constants/sounds'

const renderService = takeInstance(RenderService)
const game = takeInstance(WfSnake, 15, 15)
const floor = takeInstance(FloorModel, floorTexture, ...floorSizes)
const scene = takeInstance(SceneModel, sceneBackgroundColor, gameSounds, floor)

renderService.applySceneConfig(scene)

const startForwardPosition = takeInstance(Vector3)
const startPosition = takeInstance(Vector3)
const startRotation = takeInstance(Euler)

const keyboard = useService<SKeyboard>('keyboard')
let cameraModel = takeInstance(
  CameraModel,
  EKeyCode.D,
  game.snake.direction,
  startPosition,
  startRotation,
  renderService.cameraType
)
keyboard.registerSubscriber((keyCode) => {
  if (KeysToMoveMap[keyCode]) {
    cameraModel = cameraModel.takeChanged({
      directionKeyCode: keyCode,
      cameraPosition: startPosition,
      cameraRotation: startRotation,
      cameraType: renderService.cameraType,
      direction: game.snake.direction,
    })
    cameraModel = calculateDirection(cameraModel)
    applyCameraModelToGame(game, cameraModel)
    applyCameraModelToRenderService(renderService, cameraModel)
  }
})

renderService.setLeadId(leadPointId)
game.afterNextFrame(() => {
  useNextFrameDrawProcedure(renderService, game, startForwardPosition)
})

const cameraRotation = ModelsPool.cameraRotation()

const { cameraPositionTick, camera } = useSnakeCameraAnimation()
renderService.setAfterAnimate((additional: number) => {
  camera.value = renderService.camera

  thenIf(camera3Check(renderService.cameraType), () => {
    additional = additional > 1 ? 1 : additional
    const tickResult: any = useDrawTickProcedure(
      renderService,
      game,
      cameraRotation
    )

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
  renderService.render(canvasWrapper.value)
  game.run()
  useBordersDrawProcedure(renderService, game)

  setTimeout(() => {
    renderService.camera3()
  })
})
</script>
