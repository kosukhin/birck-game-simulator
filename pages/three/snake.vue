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
import { create } from '~~/src/Common/Library/I'
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
import { sceneEffectHandler } from '~~/src/Common/Library/ThreeD/Modules/scene/sceneEffectHandler'
import { keyPressEffectHandler } from '~/src/Snake/EffectHandlers/keyPressEffectHandler'
import { frameEffectHandler } from '~/src/Snake/EffectHandlers/frameEffectHandler'
import { tickEffectHandler } from '~/src/Snake/EffectHandlers/tickEffectHandler'

sceneEffectHandler()
keyPressEffectHandler()
frameEffectHandler()
tickEffectHandler()

const renderService = create(RenderService)
const game = create(WfSnake, 15, 15)
const floor = create(FloorModel, floorTexture, ...floorSizes)
const scene = create(Scene, sceneBackgroundColor, gameSounds, floor)

sceneEffect.apply(scene, renderService)

onNewKey(async (keyCode) => {
  const keyPress = create(KeyPress, keyCode)
  await keyPressEffect.apply(keyPress)
})

onFrame(game, async () => {
  const frame = create(Frame, {})
  await frameEffect.apply(frame)
})

onTick(renderService, async (additional: number) => {
  const tick = create(Tick, additional)
  await tickEffect.apply(tick)
})

const canvasWrapper = ref()
onMounted(() => {
  renderService.render(canvasWrapper.value)
  game.run()
})
</script>
