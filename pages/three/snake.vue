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
import { partial } from 'lodash'
import KeyboardHint from '~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import { Floor } from '~~/app/appModules/common/floor'
import { renderScene } from '~~/app/appModules/common/scene'
import { renderFrame } from '~~/app/appModules/frame'
import { renderTick } from '~~/app/appModules/tick'
import { handleFrame } from '~~/app/hofs/snake/handleFrame'
import { handleKey } from '~~/app/hofs/snake/handleKey'
import { handleTick } from '~~/app/hofs/snake/handleTick'
import { ID } from '~~/app/lib/common'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { EMoveDirection } from '~~/src/Common/Types/GameTypes'
import { sceneBackgroundColor } from '~~/src/Snake/Constants/colors'
import { gameSounds } from '~~/src/Snake/Constants/sounds'
import { floorTexture } from '~~/src/Snake/Constants/textures'
import { onNewKey } from '~~/src/Snake/Services/io'
import { onTick } from '~~/src/Snake/Services/render'
import { WfSnake, onFrame } from '~~/src/Snake/Workflows/WfSnake'

const fieldSize: [number, number] = [15, 15]
const renderService = new RenderService()
const game = new WfSnake(...fieldSize)

const setDirection = (direction: EMoveDirection) => {
  game.moveSnake(direction)
  renderService.setLeadDirection(direction)
}
const getDirection = () => game.snake.direction

onNewKey((keyCode) => {
  handleKey(partial(ID, keyCode), getDirection, setDirection)
})

const getGame = partial(ID, game)
const getRenderService = partial(ID, renderService)

renderScene(
  getGame,
  getRenderService,
  fieldSize,
  sceneBackgroundColor,
  gameSounds,
  new Floor(floorTexture, [0, 0], [20, 20], 2400, 2400, 100, 1)
)

const setGameSpeed = renderService.setGameSpeed.bind(renderService)
const frameRenderer = partial(renderFrame, getRenderService)

onFrame(game, () => {
  handleFrame(getGame, setGameSpeed, frameRenderer)
})

const tickRenderer = partial(renderTick, getRenderService)

onTick(renderService, (additional: number) => {
  handleTick(getGame, partial(ID, additional), tickRenderer)
})

const canvasWrapper = ref<HTMLElement>()
onMounted(() => {
  canvasWrapper.value && renderService.render(canvasWrapper.value)
  game.run()
})
</script>
