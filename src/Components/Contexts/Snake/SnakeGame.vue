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
import { WfMain } from '~~/src/Workflows/Snake/WfMain'

const game = new WfMain()
game.run()
</script>
