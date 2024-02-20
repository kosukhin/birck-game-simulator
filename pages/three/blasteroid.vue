<template>
  <div>
    <div class="text-center">
      <RouterLink to="/simulator/blasteroid/">
        Классический бластероид
      </RouterLink>
    </div>
    <h1>Бластероид 3Д</h1>
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
    <KeyboardHint @pause="actions.pause()" />
  </div>
</template>

<script setup lang="ts">
import partial from 'lodash/partial'
import KeyboardHint from '~~/src/common/components/KeyboardHint/KeyboardHint.vue'
import ThreeDView from '~~/src/common/components/ThreeDView/ThreeDView.vue'
import { Camera } from '~~/src/common/types/Camera'
import { GameGrid, GameSettings } from '~~/src/common/types/Game'
import { keyboard } from '~~/src/common/utils/keyboard'
import { refState } from '~~/src/common/utils/state'
import { EKeyCode, EMoveDirection } from '~~/src/common/types/GameTypes'
import { useBlasteroid } from '~~/src/blasteroid/modules/blasteroidGame'

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
const actions = useBlasteroid(
  partial(refState, gameSettings),
  partial(refState, gameGrid)
)
actions.start()

keyboard((key: EKeyCode) => {
  if (key === EKeyCode.SPC) {
    actions.shoot()
  }

  if (key === EKeyCode.A) {
    actions.moveByX(-1)
  }

  if (key === EKeyCode.D) {
    actions.moveByX(1)
  }
})

const blockGroupColor = {
  shoot: '#25ff25',
  blasteroid: '#ff2c2c',
  enemy: '#00f',
}
const camera: Camera = {
  cameraHeightDistance: 200,
  lookFromBlockId: 'tail1',
  lookToBlockId: 'lead',
}
const angles = {
  x: 7,
  y: 0,
  z: 0,
}
</script>
