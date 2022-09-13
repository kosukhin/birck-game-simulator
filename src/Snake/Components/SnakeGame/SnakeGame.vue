<template>
    <div class="game screen">
        <div v-if="game.isGameOver.value" class="game-over">
            <p>{{ $services.lang.t('Game over') }}</p>
            <p>{{ $services.lang.t('Score') }}: {{ game.score }}</p>
        </div>
        <div class="grid-header">
            {{ $services.lang.t('Score') }}: {{ game.score }},
            {{ $services.lang.t('Speed') }}:
            {{ game.speed }}
        </div>
        <CanvasView :grid="game.grid" :fps="10" />
        <KeyboardHint @pause="onPaused" />
    </div>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useService } from '~~/src/Common/Helpers/HService'
import { SKeyboard } from '~~/src/Common/Services/SKeyboard'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'
import { КeysToMoveMap, EKeyCode } from '~~/src/Common/Types/GameTypes'
import CanvasView from '~~/src/Common/Components/CanvasView/CanvasView.vue'
import KeyboardHint from '~~/src/Common/Components/KeyboardHint/KeyboardHint.vue'

const keyboard = useService<SKeyboard>('keyboard')
const game = new WfSnake()
game.run()

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: EKeyCode) => {
    if (КeysToMoveMap[key] !== undefined) {
        game.moveSnake(КeysToMoveMap[key])
    }
})

const onPaused = () => {
    game.pause()
}

onUnmounted(() => {
    game.setGameOver()
})
</script>
