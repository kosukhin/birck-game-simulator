<template>
  <div class="game screen">
    <div v-if="gameSettings.isGameOver" class="game-over">
      <el-result
        :sub-title="`${$t('Score')}: ${gameSettings.score}`"
        :title="$t('Game over')"
        icon="error"
      />
    </div>
    <RouterLink to="/three/tetris">{{ $t('Tetris 3D') }}</RouterLink>
    <div class="grid-header">
      {{ $t('Score') }}: {{ gameSettings.score }}, {{ $t('Speed') }}:
      {{ gameSettings.speed }}
    </div>
    <CanvasView :fps="10" :grid="grid" />
    <KeyboardHint @pause="tetrisActions.pause" />
  </div>
</template>

<script lang="ts" setup>
import partial from 'lodash/partial'
import { useTetris } from '~/src/tetris/composables/tetrisGame'
import CanvasView from '~~/src/common/components/CanvasView/CanvasView.vue'
import KeyboardHint from '~~/src/common/components/KeyboardHint/KeyboardHint.vue'
import { MGrid } from '~~/src/common/models/MGrid'
import { GameGrid, GameSettings } from '~~/src/common/types/Game'
import {
  EKeyCode,
  EMoveDirection,
  KeysToMoveMap,
} from '~~/src/common/types/GameTypes'
import { gameGridToMGrid } from '~~/src/common/utils/game'
import { keyboard } from '~~/src/common/utils/keyboard'
import { refValue } from '~~/src/common/utils/state'

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
  partial(refValue, gameSettings),
  partial(refValue, gameGrid)
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
