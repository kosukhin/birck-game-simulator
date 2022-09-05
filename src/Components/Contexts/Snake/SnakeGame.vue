<template>
    <div class="game screen">
        <nuxt-link class="back" to="/simulator/">
            {{ $services.lang.t('Back') }} &rarr;
        </nuxt-link>
        <GridView :key="game.updateCounter.value" :grid="game.grid.render()" />
    </div>
</template>

<script setup lang="ts">
import GridView from '~~/src/Components/Common/GridView/GridView.vue'
import { useService } from '~~/src/Helpers/HService'
import { KeyCode, SKeyboard } from '~~/src/Services/SKeyboard'
import { MoveDirection, WfMain } from '~~/src/Workflows/Snake/WfMain'

const keyboard = useService<SKeyboard>('keyboard')
const game = new WfMain()
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
</script>
