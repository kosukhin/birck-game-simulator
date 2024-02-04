<template>
  <div class="game screen">
    <div v-if="gameSettings.isGameOver" class="game-over">
      <el-result
        :sub-title="`${$services.lang.t('Score')}: ${gameSettings.score}`"
        :title="$services.lang.t('Game over')"
        icon="error"
      />
    </div>
    <RouterLink to="/three/tetris">Тетрис 3д</RouterLink>
    <div class="grid-header">
      {{ $services.lang.t('Score') }}: {{ gameSettings.score }},
      {{ $services.lang.t('Speed') }}:
      {{ gameSettings.speed }}
    </div>
    <CanvasView :fps="10" :grid="grid" />
    <KeyboardHint @pause="tetrisActions.pause" />
  </div>
</template>

<script lang="ts" setup>
import partial from 'lodash/partial'
import CanvasView from '~~/src/Common/Components/CanvasView/CanvasView.vue'
import KeyboardHint from '~~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import { GameGrid, GameSettings } from '~/src/Common/cpu/providers/types/Game'
import {
  EKeyCode,
  EMoveDirection,
  KeysToMoveMap,
} from '~/src/Common/Types/GameTypes'
import { MGrid } from '~/src/Common/Models/MGrid'
import { gameGridToMGrid } from '~/src/Common/cpu/utils/game'
import { useTetris } from '~/src/Tetris/cpu/composables/useTetris'
import { refState } from '~/src/Common/cpu/utils/state'
import { timer } from '~/src/Common/cpu/utils/timer'
import { keyboard } from '~/src/Common/cpu/utils/keyboard'

const gameSettings = ref<GameSettings>({
  isGameOver: false,
  score: 0,
  speed: 400,
  isPaused: false,
  frameCounter: 1,
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

const grid = new MGrid({
  ...gameGrid.value.gameSize,
  bgBitmap: gameGridToMGrid(gameGrid.value),
})

watchEffect(() => {
  grid.setGrid(gameGridToMGrid(gameGrid.value))
})
</script>
