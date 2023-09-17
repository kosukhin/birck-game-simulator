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
    <CanvasView :fps="20" :grid="game.grid" />
    <KeyboardHint @pause="onPaused">
      <SpaceHint />
      <br />
    </KeyboardHint>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import SpaceHint from '../../../Common/Components/KeyboardHint/SpaceHint.vue'
import { WfBlasteroid } from '~~/src/Blasteroid/Workflows/WfBlasteroid'
import CanvasView from '~~/src/Common/Components/CanvasView/CanvasView.vue'
import KeyboardHint from '~~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import { useService } from '~~/src/Common/Helpers/HService'
import { SKeyboard } from '~~/src/Common/Services/SKeyboard'
import {
  EKeyCode,
  EMoveDirection,
  KeysToMoveMap,
} from '~~/src/Common/Types/GameTypes'

const keyboard = useService<SKeyboard>('keyboard')
const game = new WfBlasteroid()
game.run()

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: EKeyCode) => {
  game.move(KeysToMoveMap[key] ?? EMoveDirection.up)

  if (key === EKeyCode.SPC) {
    game.shoot()
  }
})

const emit = defineEmits(['grid'])
onMounted(() => {
  emit('grid', game.grid)
})

const onPaused = () => {
  game.pause()
}
</script>
