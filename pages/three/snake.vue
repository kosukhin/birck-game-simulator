<template>
  <div>
    <div class="text-center">
      <RouterLink to="/simulator/snake/">Классическая змейка</RouterLink>
    </div>
    <h1>Змейка 3Д</h1>
    <div v-if="settings.isGameOver" class="game-over">
      <el-result
        :sub-title="`${'Score'}: ${settings.score}`"
        :title="'Game over'"
        icon="error"
      />
    </div>
    <div class="grid-header text-center">
      {{ 'Score' }}: {{ settings.score }},
      {{ 'Speed' }}:
      {{ settings.speed }}
    </div>
    <ThreeDView
      :frame-counter="settings.frameCounter"
      :speed="settings.speed"
      :camera="camera"
      :game-grid="gameGrid"
      :block-group-color="blockGroupColor"
      floor-texture="/hello.jpg"
      bounds-color="#ccc"
      :direction="settings.direction"
    />
    <KeyboardHint @pause="game.pause()" />
  </div>
</template>

<script setup lang="ts">
import partial from 'lodash/partial'
import KeyboardHint from '~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import ThreeDView from '~/src/Common/Components/ThreeDView/ThreeDView.vue'
import { GameGrid, GameSettings } from '~/src/Common/cpu/providers/types/Game'
import { useSnake } from '~/src/Snake/cpu/composables/useSnake'
import { refState } from '~/src/Common/cpu/utils/state'
import { timer } from '~/src/Common/cpu/utils/timer'
import { EKeyCode, EMoveDirection } from '~/src/Common/Types/GameTypes'
import { Camera } from '~/src/Common/cpu/providers/types/Camera'
import { handleKey } from '~/app/hofs/snake/handleKey'
import { keyboard } from '~/src/Common/cpu/utils/keyboard'

const settings = ref<GameSettings>({
  frameCounter: 1,
  isGameOver: false,
  score: 0,
  speed: 300,
  isPaused: false,
  direction: EMoveDirection.right,
})
const gameGrid = ref<GameGrid>({
  blocks: [],
  gameSize: {
    height: 15,
    width: 15,
  },
})
const snakeActions = useSnake(
  partial(refState, settings),
  partial(refState, gameGrid),
  timer
)
snakeActions.start()

keyboard((key: EKeyCode) => {
  handleKey(
    () => key,
    () => settings.value.direction,
    snakeActions.changeDirection
  )
})

const blockGroupColor = {
  target: '#25ff25',
  lead: '#cd0000',
  tail: '#ff2c2c',
}
const camera: Camera = {
  cameraHeightDistance: 60,
  lookFromBlockId: 'tail1',
  lookToBlockId: 'lead',
}
</script>
