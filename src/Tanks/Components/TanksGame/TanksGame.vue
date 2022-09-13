<template>
    <div class="game screen">
        <div v-if="game.isGameOver.value" class="game-over">
            <p>{{ $services.lang.t('Game over') }}</p>
            <p>{{ $services.lang.t('Score') }}: {{ game.score }}</p>
        </div>
        <div class="grid-header">
            {{ $services.lang.t('Score') }}: {{ game.score }}
        </div>
        <CanvasView :grid="game.grid" :fps="20" />
        <KeyboardHint @pause="onPaused">
            <SpaceHint />
        </KeyboardHint>
    </div>
</template>

<script setup lang="ts">
import SpaceHint from '../../../Common/Components/KeyboardHint/SpaceHint.vue'
import { useService } from '~~/src/Common/Helpers/HService'
import { EKeyCode, SKeyboard } from '~~/src/Common/Services/SKeyboard'
import { WfTanks } from '~~/src/Tanks/Workflows/WfTanks'
import { КeysToMoveMap } from '~~/src/Common/Types/GameTypes'
import CanvasView from '~~/src/Common/Components/CanvasView/CanvasView.vue'
import KeyboardHint from '~~/src/Common/Components/KeyboardHint/KeyboardHint.vue'

const keyboard = useService<SKeyboard>('keyboard')
const game = new WfTanks()
game.run()

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: EKeyCode) => {
    if (КeysToMoveMap[key] !== undefined) {
        game.moveTank(КeysToMoveMap[key])
    }

    if (key === EKeyCode.SPC) {
        game.shoot()
    }
})

const onPaused = () => {
    game.pause()
}
</script>
