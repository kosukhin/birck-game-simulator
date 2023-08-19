<template>
  <div class="game screen">
    <div v-if="game.isGameOver.value" class="game-over">
      <el-result
        icon="error"
        :title="$services.lang.t('Game over')"
        :sub-title="`${$services.lang.t('Score')}: ${game.score.value}`"
      />
    </div>
    <div class="grid-header">
      {{ $services.lang.t('Score') }}: {{ game.score }},
      {{ $services.lang.t('Speed') }}:
      {{ game.speed }}
    </div>
    <CanvasView :grid="game.grid" :fps="10" />
    <KeyboardHint @pause="onPaused" />
  </div>
  <ThreeDRenderer />
</template>

<script setup lang="ts">
import { onUnmounted, onMounted } from 'vue'
import { useService } from '~~/src/Common/Helpers/HService'
import { SKeyboard } from '~~/src/Common/Services/SKeyboard'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'
import { KeysToMoveMap, EKeyCode } from '~~/src/Common/Types/GameTypes'
import CanvasView from '~~/src/Common/Components/CanvasView/CanvasView.vue'
import KeyboardHint from '~~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import ThreeDRenderer from '~~/src/Common/Library/ThreeD/Components/ThreeDRenderer.vue'

const keyboard = useService<SKeyboard>('keyboard')
const game = new WfSnake()
game.run()

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: EKeyCode) => {
  if (KeysToMoveMap[key] !== undefined) {
    game.moveSnake(KeysToMoveMap[key])
  }
})

const onPaused = () => {
  game.pause()
}

const emit = defineEmits(['grid'])
onMounted(() => {
  emit('grid', game.grid)
})

onUnmounted(() => {
  game.setGameOver()
})
</script>
