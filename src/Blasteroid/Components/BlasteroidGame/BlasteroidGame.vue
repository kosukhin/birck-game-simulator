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
        <CanvasView :grid="game.grid" :fps="20" />
        <KeyboardHint @pause="onPaused">
            <SpaceHint />
            <br />
        </KeyboardHint>
    </div>
</template>

<script setup lang="ts">
import SpaceHint from '../../../Common/Components/KeyboardHint/SpaceHint.vue'
import { WfBlasteroid } from '~~/src/Blasteroid/Workflows/WfBlasteroid'
import CanvasView from '~~/src/Common/Components/CanvasView/CanvasView.vue'
import KeyboardHint from '~~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import { useService } from '~~/src/Common/Helpers/HService'
import { SKeyboard } from '~~/src/Common/Services/SKeyboard'
import {
    EKeyCode,
    EMoveDirection,
    КeysToMoveMap,
} from '~~/src/Common/Types/GameTypes'

const keyboard = useService<SKeyboard>('keyboard')
const game = new WfBlasteroid()
game.run()

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: EKeyCode) => {
    game.move(КeysToMoveMap[key] ?? EMoveDirection.up)

    if (key === EKeyCode.SPC) {
        game.shoot()
    }
})

const onPaused = () => {
    game.pause()
}
</script>
