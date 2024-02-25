<template>
  <div class="game screen">
    <div v-if="settings.isGameOver" class="game-over">
      <el-result
        :sub-title="`${$t('Score')}: ${settings.score}`"
        :title="$t('Game over')"
        icon="error"
      />
    </div>
    <RouterLink to="/three/snake">{{ $t('Snake 3D') }}</RouterLink>
    <div class="grid-header">
      {{ $t('Score') }}: {{ settings.score }}, {{ $t('Speed') }}:
      {{ settings.speed }}
    </div>
    <CanvasView :fps="10" :grid="grid" />
    <KeyboardHint @pause="snakeActions.pause" />
  </div>
</template>

<script lang="ts" setup>
import partial from 'lodash/partial'
import KeyboardHint from '~/src/common/components/KeyboardHint/KeyboardHint.vue'
import { gameGridToMGrid } from '~/src/common/utils/game'
import CanvasView from '~~/src/common/components/CanvasView/CanvasView.vue'
import { MGrid } from '~~/src/common/models/MGrid'
import { GameGrid, GameSettings } from '~~/src/common/types/Game'
import {
  EKeyCode,
  EMoveDirection,
  KeysToMoveMap,
} from '~~/src/common/types/GameTypes'
import { keyboard } from '~~/src/common/utils/keyboard'
import { refValue } from '~~/src/common/utils/state'
import { useSnake } from '~~/src/snake/modules/snakeGame'

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
    height: 15,
    width: 15,
  },
})

const snakeActions = useSnake(
  partial(refValue, settings),
  partial(refValue, gameGrid)
)
snakeActions.start()

keyboard((key: EKeyCode) => {
  if (KeysToMoveMap[key] !== undefined) {
    snakeActions.changeDirection(KeysToMoveMap[key])
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
