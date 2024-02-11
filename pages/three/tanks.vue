<template>
  <div>
    <div class="text-center">
      <RouterLink to="/simulator/tanks/">Классические танки</RouterLink>
    </div>
    <h1>Танки 3Д</h1>
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
      :angles="angles"
    />
    <KeyboardHint @pause="actions.pause()" />
  </div>
</template>

<script setup lang="ts">
import partial from 'lodash/partial'
import KeyboardHint from '~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import ThreeDView from '~/src/Common/Components/ThreeDView/ThreeDView.vue'
import { Camera } from '~/src/Common/cpu/providers/types/Camera'
import { GameGrid, GameSettings } from '~/src/Common/cpu/providers/types/Game'
import { keyboard } from '~/src/Common/cpu/utils/keyboard'
import { refState } from '~/src/Common/cpu/utils/state'
import { timer } from '~/src/Common/cpu/utils/timer'
import {
  EKeyCode,
  EMoveDirection,
  KeysToMoveMap,
} from '~/src/Common/Types/GameTypes'
import { useTanks } from '~~/src/Tanks/cpu/composables/useTanks'

const gameSettings = ref<GameSettings>({
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
    height: 20,
    width: 20,
  },
})
const actions = useTanks(
  partial(refState, gameSettings),
  partial(refState, gameGrid),
  timer
)
actions.start()

keyboard((key: EKeyCode) => {
  if (KeysToMoveMap[key] !== undefined) {
    actions.direction(KeysToMoveMap[key])
  }
  if (key === EKeyCode.SPC) {
    actions.shoot()
  }
})

const blockGroupColor = {
  shoot: '#25ff25',
  tank: '#ff2c2c',
  bot: '#00f',
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
