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
import { onNewKey } from '~/src/Snake/Services/io'
import { onTick } from '~/src/Snake/Services/render'
import { doKeyPress } from '~~/app/appModules/keyPress/doKeyPress'
import { snakeController } from '~~/app/appModules/snake/snakeController'
import { inContext } from '~~/app/systemModules/context/context'
import { inContextModel } from '~~/app/systemModules/context/contextModel'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { WfSnake, onFrame } from '~~/src/Snake/Workflows/WfSnake'

const renderService = new RenderService()
const game = new WfSnake(15, 15)

const snakeContext = inContextModel({
  models: {
    renderService,
    game,
  },
})

inContext(snakeContext, {
  do: snakeController.initApp,
})

onNewKey((keyCode) => {
  inContext(snakeContext, {
    do: () =>
      doKeyPress({
        keyCode,
      }),
  })
})

onFrame(game, () => {
  inContext(snakeContext, {
    do: snakeController.handleFrame,
  })
})

onTick(renderService, (additional: number) => {
  inContext(snakeContext, {
    do: () => snakeController.handleTick(additional),
  })
})

const canvasWrapper = ref()
onMounted(() => {
  renderService.render(canvasWrapper.value)
  game.run()
})
</script>
