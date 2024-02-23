<template>
  <div class="game screen">
    <div v-if="gameSettings.isGameOver" class="game-over">
      <el-result
        :sub-title="`${'Score'}: ${gameSettings.score}`"
        :title="$t('Game over')"
        icon="error"
      />
    </div>
    <RouterLink to="/three/blasteroid">{{ $t('Blasteroid 3D') }}</RouterLink>
    <div class="grid-header">
      {{ $t('Score') }}: {{ gameSettings.score }}, {{ $t('Speed') }}:
      {{ gameSettings.speed }}
    </div>
    <CanvasView :fps="10" :grid="grid" />
    <KeyboardHint @pause="actions.pause" />
  </div>
</template>

<script lang="ts" setup>
import partial from 'lodash/partial'
import { GameGrid, GameSettings } from '~/src/common/types/Game'
import { gameGridToMGrid } from '~/src/common/utils/game'
import { keyboard } from '~/src/common/utils/keyboard'
import { refState } from '~/src/common/utils/state'
import { MGrid } from '~/src/common/models/MGrid'
import { EKeyCode, EMoveDirection } from '~/src/common/types/GameTypes'
import { useBlasteroid } from '~~/src/blasteroid/modules/blasteroidGame'
import CanvasView from '~~/src/common/components/CanvasView/CanvasView.vue'
import KeyboardHint from '~~/src/common/components/KeyboardHint/KeyboardHint.vue'

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

const grid = new MGrid({
  ...gameGrid.value.gameSize,
  bgBitmap: gameGridToMGrid(gameGrid.value),
})

watchEffect(() => {
  grid.setGrid(gameGridToMGrid(gameGrid.value))
})
</script>
