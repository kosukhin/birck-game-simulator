<template>
    <div class="game screen">
        <nuxt-link class="back" to="/simulator/">
            {{ $services.lang.t('Back') }} &rarr;
        </nuxt-link>
        <GridView :key="game.updateCounter.value" :grid="game.grid.render()" />
    </div>
</template>

<script setup lang="ts">
import GridView from '~~/src/Common/Components/GridView/GridView.vue'
import { HLog } from '~~/src/Common/Helpers/HLog'
import { useService } from '~~/src/Common/Helpers/HService'
import { KeyCode, SKeyboard } from '~~/src/Common/Services/SKeyboard'
import { WfTanks } from '~~/src/Tanks/Workflows/WfTanks'
import { КeysToMoveMap } from '~~/src/Common/Types/GameTypes'

const keyboard = useService<SKeyboard>('keyboard')
const game = new WfTanks()

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: KeyCode) => {
    HLog.log('tanks', key)
    if (КeysToMoveMap[key] !== undefined) {
        game.moveTank(КeysToMoveMap[key])
    }

    if (key === KeyCode.SPC) {
        game.shoot()
    }
})
</script>
