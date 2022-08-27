<template>
    <div class="tetris">
        <TetrisGame
            v-if="screen==='start'"
            @back="back"
        />
        <Settings
            v-else-if="screen==='settings'"
            @back="back"
        />
        <Menu v-else @open="open" />
    </div>
</template>

<script setup>
import { ref } from "#imports";
import Menu from "~~/src/Components/Menu/Menu.vue";
import Settings from "~~/src/Components/Settings/Settings.vue";
import TetrisGame from "~~/src/Components/Tetris/TetrisGame.vue";

const screen = ref('');

const open = (name) => {
    screen.value = name;
}

const back = () => {
    screen.value = '';
}
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
