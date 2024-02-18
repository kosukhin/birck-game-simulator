<template>
  <div class="game screen">
    <div v-if="gameSettings.isGameOver" class="game-over">
      <el-result
        :sub-title="`${$services.lang.t('Score')}: ${gameSettings.score}`"
        :title="$services.lang.t('Game over')"
        icon="error"
      />
    </div>
    <RouterLink to="/three/tetris">Бластероид 3д</RouterLink>
    <div class="grid-header">
      {{ $services.lang.t('Score') }}: {{ gameSettings.score }},
      {{ $services.lang.t('Speed') }}:
      {{ gameSettings.speed }}
    </div>
    <CanvasView :fps="10" :grid="grid" />
    <KeyboardHint @pause="actions.pause" />
  </div>
</template>

<script lang="ts" setup>
import partial from 'lodash/partial'
import { GameGrid, GameSettings } from '~/src/Common/cpu/providers/types/Game'
import { gameGridToMGrid } from '~/src/Common/cpu/utils/game'
import { keyboard } from '~/src/Common/cpu/utils/keyboard'
import { refState } from '~/src/Common/cpu/utils/state'
import { MGrid } from '~/src/Common/Models/MGrid'
import { EKeyCode, EMoveDirection } from '~/src/Common/Types/GameTypes'
import { useBlasteroid } from '~~/src/Blasteroid/cpu/composables/useBlasteroid'
import CanvasView from '~~/src/Common/Components/CanvasView/CanvasView.vue'
import KeyboardHint from '~~/src/Common/Components/KeyboardHint/KeyboardHint.vue'

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
