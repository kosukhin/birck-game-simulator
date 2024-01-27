<template>
  <div class="game screen">
    <div v-if="settings.isGameOver" class="game-over">
      <el-result
        :sub-title="`${$services.lang.t('Score')}: ${settings.score}`"
        :title="$services.lang.t('Game over')"
        icon="error"
      />
    </div>
    <div class="grid-header">
      {{ $services.lang.t('Score') }}: {{ settings.score }},
      {{ $services.lang.t('Speed') }}:
      {{ settings.speed }}
    </div>
    <CanvasView :fps="10" :grid="grid" />
    <KeyboardHint @pause="snakeActions.pause()" />
    <RouterLink to="/three/snake"> Змейка 3д</RouterLink>
  </div>
</template>

<script lang="ts" setup>
import partial from 'lodash/partial'
import CanvasView from '~~/src/Common/Components/CanvasView/CanvasView.vue'
import KeyboardHint from '~~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import { useSnake } from '~~/src/Snake/cpu/composables/useSnake'
import { GameGrid, GameSettings } from '~~/src/Common/cpu/providers/types/Game'
import { refState } from '~~/src/Common/cpu/utils/state'
import { timer } from '~~/src/Common/cpu/utils/timer'
import { gameGridToMGrid } from '~/src/Common/cpu/utils/game'
import { useService } from '~/src/Common/Helpers/HService'
import { SKeyboard } from '~/src/Common/Services/SKeyboard'
import { EKeyCode, KeysToMoveMap } from '~/src/Common/Types/GameTypes'
import { MGrid } from '~/src/Common/Models/MGrid'

const settings = ref<GameSettings>({
  isGameOver: false,
  score: 0,
  speed: 500,
  isPaused: false,
})
const gameGrid = ref<GameGrid>({
  blocks: [],
  gameSize: {
    height: 15,
    width: 15,
  },
})
const snakeActions = useSnake(
  partial(refState, settings),
  partial(refState, gameGrid),
  timer
)
snakeActions.start()

// FIXME переделать сервис убрать
const keyboard = useService<SKeyboard>('keyboard')
keyboard.clearSubscribers()
keyboard.registerSubscriber((key: EKeyCode) => {
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
