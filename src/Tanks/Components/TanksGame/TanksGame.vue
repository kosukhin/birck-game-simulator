<template>
    <div class="game screen">
        <nuxt-link class="back" to="/simulator/">
            {{ $services.lang.t('Back') }} &rarr;
        </nuxt-link>
        <div v-if="game.isGameOver.value" class="game-over">
            <p>{{ $services.lang.t('Game over') }}</p>
            <p>{{ $services.lang.t('Score') }}: {{ game.score }}</p>
        </div>
        <div class="grid-header">
            {{ $services.lang.t('Score') }}: {{ game.score }}
        </div>
        <CanvasView :grid="game.grid" :fps="20" />
    </div>
</template>

<script setup lang="ts">
import { useService } from '~~/src/Common/Helpers/HService'
import { KeyCode, SKeyboard } from '~~/src/Common/Services/SKeyboard'
import { WfTanks } from '~~/src/Tanks/Workflows/WfTanks'
import { КeysToMoveMap } from '~~/src/Common/Types/GameTypes'
import CanvasView from '~~/src/Common/Components/CanvasView/CanvasView.vue'

const keyboard = useService<SKeyboard>('keyboard')
const game = new WfTanks()
game.run()

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: KeyCode) => {
    if (КeysToMoveMap[key] !== undefined) {
        game.moveTank(КeysToMoveMap[key])
    }

    if (key === KeyCode.SPC) {
        game.shoot()
    }
})
</script>
