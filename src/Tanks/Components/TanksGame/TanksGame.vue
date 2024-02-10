<template>
  <div class="game screen">
    <div v-if="settings.isGameOver" class="game-over">
      <el-result
        :sub-title="`${$services.lang.t('Score')}: ${settings.score}`"
        :title="$services.lang.t('Game over')"
        icon="error"
      />
    </div>
    <RouterLink to="/three/snake"> Змейка 3д</RouterLink>
    <div class="grid-header">
      {{ $services.lang.t('Score') }}: {{ settings.score }},
      {{ $services.lang.t('Speed') }}:
      {{ settings.speed }}
    </div>
    <CanvasView :fps="10" :grid="grid" />
    <KeyboardHint @pause="snakeActions.pause()" />
  </div>
</template>

<script lang="ts" setup>
import partial from 'lodash/partial'
import { gameGridToMGrid } from '~/src/Common/cpu/utils/game'
import { keyboard } from '~/src/Common/cpu/utils/keyboard'
import { MGrid } from '~/src/Common/Models/MGrid'
import {
  EKeyCode,
  EMoveDirection,
  KeysToMoveMap,
} from '~/src/Common/Types/GameTypes'
import CanvasView from '~~/src/Common/Components/CanvasView/CanvasView.vue'
import KeyboardHint from '~~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import { GameGrid, GameSettings } from '~~/src/Common/cpu/providers/types/Game'
import { refState } from '~~/src/Common/cpu/utils/state'
import { timer } from '~~/src/Common/cpu/utils/timer'
import { useTanks } from '~~/src/Tanks/cpu/composables/useTanks'

const settings = ref<GameSettings>({
  isGameOver: false,
  score: 0,
  speed: 300,
  isPaused: false,
  frameCounter: 1,
  direction: EMoveDirection.right,
})
const gameGrid = ref<GameGrid>({
  blocks: [],
  gameSize: {
    height: 20,
    width: 20,
  },
})
const snakeActions = useTanks(
  partial(refState, settings),
  partial(refState, gameGrid),
  timer
)
snakeActions.start()

keyboard((key: EKeyCode) => {
  if (KeysToMoveMap[key] !== undefined) {
    snakeActions.direction(KeysToMoveMap[key])
  }
})

const grid = new MGrid({
  ...gameGrid.value.gameSize,
  bgBitmap: gameGridToMGrid(gameGrid.value),
})

watchEffect(() => {
  grid.setGrid(gameGridToMGrid(gameGrid.value))
})
</script>
