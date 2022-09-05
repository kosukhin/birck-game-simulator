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
import { SKeyboard } from '~~/src/Services/SKeyboard'
import { WfMain } from '~~/src/Workflows/Snake/WfMain'
import { useLog } from '~~/src/Helpers/HLog'

const snakeLog = useLog('snake')
const keyboard = useService<SKeyboard>('keyboard')
const game = new WfMain()
game.run()

keyboard.clearSubscribers()
keyboard.registerSubscriber((key) => {
    snakeLog(key)
})
</script>
