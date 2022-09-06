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
            {{ $services.lang.t('Score') }}: {{ game.score }},
            {{ $services.lang.t('Speed') }}:
            {{ game.speed }}
        </div>
        <GridView :key="game.updateCounter.value" :grid="game.grid.render()" />
    </div>
</template>

<script setup lang="ts">
import GridView from '~~/src/Common/Components/GridView/GridView.vue'
import { useService } from '~~/src/Common/Helpers/HService'
import { KeyCode, SKeyboard } from '~~/src/Common/Services/SKeyboard'
import { MoveDirection, WfSnake } from '~~/src/Snake/Workflows/WfSnake'

const keyboard = useService<SKeyboard>('keyboard')
const game = new WfSnake()
game.run()

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: KeyCode) => {
    const keysToMoveMap = {
        [KeyCode.W]: MoveDirection.up,
        [KeyCode.S]: MoveDirection.down,
        [KeyCode.A]: MoveDirection.left,
        [KeyCode.D]: MoveDirection.right,
    }

    if (keysToMoveMap[key] !== undefined) {
        game.moveSnake(keysToMoveMap[key])
    }
})

onUnmounted(() => {
    game.gameIsOver()
})
</script>
