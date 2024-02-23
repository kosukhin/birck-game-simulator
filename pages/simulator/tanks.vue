<template>
  <div class="game screen">
    <div v-if="settings.isGameOver" class="game-over">
      <el-result
        :sub-title="`${$t('Score')}: ${settings.score}`"
        :title="$t('Game over')"
        icon="error"
      />
    </div>
    <RouterLink to="/three/tanks">{{ $t('Tanks 3D') }}</RouterLink>
    <div class="grid-header">
      {{ $t('Score') }}: {{ settings.score }}, {{ $t('Speed') }}:
      {{ settings.speed }}
    </div>
    <CanvasView :fps="10" :grid="grid" />
    <KeyboardHint @pause="actions.pause()" />
  </div>
</template>

<script lang="ts" setup>
import partial from 'lodash/partial'
import { gameGridToMGrid } from '~/src/common/utils/game'
import { keyboard } from '~/src/common/utils/keyboard'
import { MGrid } from '~~/src/common/models/MGrid'
import {
  EKeyCode,
  EMoveDirection,
  KeysToMoveMap,
} from '~~/src/common/types/GameTypes'
import CanvasView from '~~/src/common/components/CanvasView/CanvasView.vue'
import KeyboardHint from '~~/src/common/components/KeyboardHint/KeyboardHint.vue'
import { GameGrid, GameSettings } from '~~/src/common/types/Game'
import { refState } from '~~/src/common/utils/state'
import { timer } from '~~/src/common/utils/timer'
import { useTanks } from '~~/src/tanks/modules/tanksGame'

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
const actions = useTanks(
  partial(refState, settings),
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

const grid = new MGrid({
  ...gameGrid.value.gameSize,
  bgBitmap: gameGridToMGrid(gameGrid.value),
})

watchEffect(() => {
  grid.setGrid(gameGridToMGrid(gameGrid.value))
})
</script>
