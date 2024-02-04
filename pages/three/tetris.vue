<template>
  <div>
    <div class="text-center">
      <RouterLink to="/simulator/tetris/">Классический тетрис</RouterLink>
    </div>
    <h1>Тетрис 3Д</h1>
    <div v-if="gameSettings.isGameOver" class="game-over">
      <el-result
        :sub-title="`${$services.lang.t('Score')}: ${gameSettings.score}`"
        :title="$services.lang.t('Game over')"
        icon="error"
      />
    </div>
    <div class="grid-header text-center">
      {{ $services.lang.t('Score') }}: {{ gameSettings.score }},
      {{ $services.lang.t('Speed') }}:
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
    />
    <KeyboardHint @pause="tetrisActions.pause()" />
  </div>
</template>

<script setup lang="ts">
import partial from 'lodash/partial'
import KeyboardHint from '~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import ThreeDView from '~/src/Common/Components/ThreeDView/ThreeDView.vue'
import {GameGrid, GameSettings} from '~/src/Common/cpu/providers/types/Game'
import {refState} from '~/src/Common/cpu/utils/state'
import {timer} from '~/src/Common/cpu/utils/timer'
import {EKeyCode, EMoveDirection, KeysToMoveMap,} from '~/src/Common/Types/GameTypes'
import {Camera} from '~/src/Common/cpu/providers/types/Camera'
import {keyboard} from '~/src/Common/cpu/utils/keyboard'
import {useTetris} from '~/src/Tetris/cpu/composables/useTetris'

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
    width: 15,
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
  cameraHeightDistance: 150,
  lookFromBlockId: 'tail1',
  lookToBlockId: 'lead',
}
</script>
