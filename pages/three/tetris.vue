<template>
  <div>
    <div class="text-center">
      <RouterLink to="/simulator/tetris/">Классический тетрис</RouterLink>
    </div>
    <h1>Тетрис 3Д</h1>
    <div v-if="gameSettings.isGameOver" class="game-over">
      <el-result
        :sub-title="`${'Score'}: ${gameSettings.score}`"
        :title="'Game over'"
        icon="error"
      />
    </div>
    <div class="grid-header text-center">
      {{ 'Score' }}: {{ gameSettings.score }}, {{ 'Speed' }}:
      {{ gameSettings.speed }}
    </div>
    <ThreeDView
      no-animation
      :frame-counter="gameSettings.frameCounter"
      :speed="gameSettings.speed"
      :camera="camera"
      :game-grid="gameGrid"
      :block-group-color="blockGroupColor"
      floor-texture="/hello.jpg"
      bounds-color="#ccc"
      :direction="gameSettings.direction"
      :angles="angles"
    />
    <KeyboardHint @pause="tetrisActions.pause()" />
  </div>
</template>

<script setup lang="ts">
import partial from 'lodash/partial'
import KeyboardHint from '~~/src/common/components/KeyboardHint/KeyboardHint.vue'
import ThreeDView from '~~/src/common/components/ThreeDView/ThreeDView.vue'
import { GameGrid, GameSettings } from '~~/src/common/types/Game'
import { refState } from '~~/src/common/utils/state'
import { timer } from '~~/src/common/utils/timer'
import {
  EKeyCode,
  EMoveDirection,
  KeysToMoveMap,
} from '~~/src/common/types/GameTypes'
import { Camera } from '~~/src/common/types/Camera'
import { keyboard } from '~~/src/common/utils/keyboard'
import { useTetris } from '~/src/tetris/modules/tetrisGame'

const gameSettings = ref<GameSettings>({
  frameCounter: 1,
  isGameOver: false,
  score: 0,
  speed: 400,
  isPaused: false,
  direction: EMoveDirection.right,
})
const gameGrid = ref<GameGrid>({
  blocks: [],
  gameSize: {
    height: 20,
    width: 16,
  },
})

const tetrisActions = useTetris(
  partial(refState, gameSettings),
  partial(refState, gameGrid),
  timer
)
tetrisActions.start()
setTimeout(() => {
  tetrisActions.direction(EMoveDirection.up)
}, 1000)

keyboard((key: EKeyCode) => {
  if (EKeyCode.W === key) {
    tetrisActions.direction(KeysToMoveMap[key])
  }

  if (EKeyCode.S === key) {
    tetrisActions.moveDown()
  }

  if (key === EKeyCode.A) {
    tetrisActions.moveByX(-1)
  }

  if (key === EKeyCode.D) {
    tetrisActions.moveByX(1)
  }
})

const blockGroupColor = {
  turnedLeft: '#948543',
  turnedRight: '#900000',
  blasteroid: '#000cb7',
  movedRight: '#4d721c',
  movedLeft: '#6f056b',
  lineVertical: '#25ff25',
  lineHorizontal: '#00abcd',
  rectangle: '#e06f6f',
}
const camera: Camera = {
  cameraHeightDistance: 170,
  lookFromBlockId: 'tail1',
  lookToBlockId: 'lead',
}
const angles = {
  x: 7,
  y: 0,
  z: 0,
}
</script>
