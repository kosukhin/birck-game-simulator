<template>
  <div class="game screen">
    <div v-if="game.isGameOver.value" class="game-over">
      <el-result
        :sub-title="`${$services.lang.t('Score')}: ${game.score.value}`"
        :title="$services.lang.t('Game over')"
        icon="error"
      />
    </div>
    <div class="grid-header">
      {{ $services.lang.t('Score') }}: {{ game.score }},
      {{ $services.lang.t('Speed') }}:
      {{ game.speed }}
    </div>
    <CanvasView :fps="10" :grid="game.grid" />
    <KeyboardHint @pause="onPaused" />
    <RouterLink to="/three/snake"> Змейка 3д</RouterLink>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { useService } from '~~/src/Common/Helpers/HService'
import { SKeyboard } from '~~/src/Common/Services/SKeyboard'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'
import { EKeyCode, KeysToMoveMap } from '~~/src/Common/Types/GameTypes'
import CanvasView from '~~/src/Common/Components/CanvasView/CanvasView.vue'
import KeyboardHint from '~~/src/Common/Components/KeyboardHint/KeyboardHint.vue'

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
