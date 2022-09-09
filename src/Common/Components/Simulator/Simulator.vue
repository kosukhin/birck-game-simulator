<template>
    <div class="tetris">
        <component :is="gamesList[action] ?? gamesList.nogame" />
    </div>
</template>

<script lang="ts" setup>
import { useService } from '~~/src/Common/Helpers/HService'
import { SHooks } from '~~/src/Common/Services/SHooks'
import NoGame from '~~/src/Common/Components/Simulator/NoGame.vue'

const gamesList = {
    nogame: NoGame,
}
// Заполняем список игр через хук
useService<SHooks>('hooks').gamesResolving.runSubscribers(gamesList)

defineProps({
    action: {
        type: String,
        default: '',
    },
})
</script>

<style lang="scss" scoped>
.tetris {
    display: inline-block;
    background: $c_white;
    position: relative;
}
</style>
