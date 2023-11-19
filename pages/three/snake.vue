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
import KeyboardHint from '~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import { create, takeSingleton } from '~~/src/Common/Library/I'
import { FloorModel } from '~~/src/Common/Library/ThreeD/Configs/FloorModel'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { onFrame, WfSnake } from '~~/src/Snake/Workflows/WfSnake'
import { floorTexture } from '~/src/Snake/Constants/textures'
import { floorSizes } from '~/src/Snake/Constants/sizes'
import { sceneBackgroundColor } from '~/src/Snake/Constants/colors'
import { gameSounds } from '~/src/Snake/Constants/sounds'
import { onNewKey } from '~/src/Snake/Services/io'
import { onTick } from '~/src/Snake/Services/render'
import { Scene } from '~/src/Common/Library/ThreeD/Modules/scene/Scene'
import { sceneEffect } from '~/src/Common/Library/ThreeD/Modules/scene/sceneEffect'
import { KeyPress } from '~/src/Common/Library/ThreeD/Modules/keyPress/KeyPress'
import { keyPressEffect } from '~/src/Snake/Effects/keyPressEffect'
import { Frame } from '~/src/Common/Library/ThreeD/Modules/frame/Frame'
import { frameEffect } from '~/src/Snake/Effects/frameEffect'
import { Tick } from '~/src/Common/Library/ThreeD/Modules/tick/Tick'
import { tickEffect } from '~/src/Snake/Effects/tickEffect'

const renderService = takeSingleton(RenderService)
const game = create(WfSnake, 15, 15)
const floor = create(FloorModel, floorTexture, ...floorSizes)
const scene = create(Scene, sceneBackgroundColor, gameSounds, floor)

sceneEffect.apply(scene, renderService)

onNewKey((keyCode) => {
  const keyPress = create(KeyPress, keyCode)
  keyPressEffect.apply(keyPress)
})

onFrame(game, () => {
  const frame = create(Frame, {})
  frameEffect.apply(frame)
})

onTick(renderService, (additional: number) => {
  const tick = create(Tick, additional)
  tickEffect.apply(tick)
})

const canvasWrapper = ref()
onMounted(() => {
  renderService.render(canvasWrapper.value)
  game.run()
})
</script>
