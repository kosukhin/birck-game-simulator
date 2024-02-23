<template>
  <div>
    <div class="text-center">
      <RouterLink to="/simulator/snake/">Классическая змейка</RouterLink>
    </div>
    <h1>Змейка 3Д</h1>
    <div v-if="settings.isGameOver" class="game-over">
      <el-result
        :sub-title="`${$t('Score')}: ${settings.score}`"
        :title="$t('Game over')"
        icon="error"
      />
    </div>
    <div class="grid-header text-center">
      {{ $t('Score') }}: {{ settings.score }}, {{ $t('Speed') }}:
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
    <KeyboardHint @pause="snakeActions.pause()" />
  </div>
</template>

<script setup lang="ts">
import partial from 'lodash/partial'
import KeyboardHint from '~~/src/common/components/KeyboardHint/KeyboardHint.vue'
import ThreeDView from '~~/src/common/components/ThreeDView/ThreeDView.vue'
import { GameGrid, GameSettings } from '~~/src/common/types/Game'
import { useSnake } from '~~/src/snake/modules/snakeGame'
import { refState } from '~~/src/common/utils/state'
import { timer } from '~~/src/common/utils/timer'
import {
  EKeyCode,
  EMoveDirection,
  KeysToMoveCamera3,
  KeysToMoveMap,
} from '~~/src/common/types/GameTypes'
import { Camera } from '~~/src/common/types/Camera'
import { keyboard } from '~~/src/common/utils/keyboard'

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

keyboard((keyCode: EKeyCode) => {
  if (keyCode === EKeyCode.W || keyCode === EKeyCode.S) {
    return
  }

  if (KeysToMoveMap[keyCode] === undefined) {
    return
  }

  const currentDirection = settings.value.direction
  const newDirection = KeysToMoveCamera3[currentDirection][keyCode]
  snakeActions.changeDirection(newDirection)
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
