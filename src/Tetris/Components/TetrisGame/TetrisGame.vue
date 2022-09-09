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
        <KeyboardHint />
    </div>
</template>

<script setup lang="ts">
import { WfTetris } from '~~/src/Tetris/Workflows/WfTetris'
import { useService } from '~~/src/Common/Helpers/HService'
import { KeyCode, SKeyboard } from '~~/src/Common/Services/SKeyboard'
import { HArray } from '~~/src/Common/Helpers/HArray'
import CanvasView from '~~/src/Common/Components/CanvasView/CanvasView.vue'
import KeyboardHint from '~~/src/Common/Components/KeyboardHint/KeyboardHint.vue'

const keyboard = useService<SKeyboard>('keyboard')
const game = new WfTetris()
game.run()

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: KeyCode) => {
    const shape = game.grid.getFirstShape()

    if (!shape) {
        return
    }

    if (key === KeyCode.W) {
        shape.setBitmap(HArray.rotate90(shape.bitmap))
    }

    if (key === KeyCode.S) {
        shape.moveY(1)
    }

    if (key === KeyCode.A) {
        shape.moveX(-1)
    }

    if (key === KeyCode.D) {
        shape.moveX(1)
    }
})
</script>
