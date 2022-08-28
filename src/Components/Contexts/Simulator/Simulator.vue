<template>
    <div class="tetris">
        <component :is="componentsMap[action]" />
    </div>
</template>

<script setup>
import Settings from '~~/src/Components/Contexts/Simulator/Settings/Settings.vue'
import TetrisGame from '~~/src/Components/Contexts/Tetris/TetrisGame.vue'

const componentsMap = {
    settings: Settings,
    tetris: TetrisGame,
}

defineProps({
    action: {
        type: String,
        default: '',
    },
})
</script>

<style lang="scss" scoped>
.tetris {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 400px;
    border: solid 1px $c_black;
    background: $c_white;
}
</style>
