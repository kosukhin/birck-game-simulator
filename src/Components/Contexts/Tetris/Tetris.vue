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
import Menu from "@/src/Components/Contexts/Menu/Menu";
import Settings from "@/src/Components/Contexts/Settings/Settings";
import TetrisGame from "~/src/Components/Contexts/Tetris/TetrisGame";

const screen = ref('');

const open = (name) => {
    screen.value = name;
}

const back = () => {
    screen.value = '';
}
</script>

<style scoped>
    .tetris {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        height: 400px;
        border: solid 1px #333;
        background: #fff;
    }
</style>
