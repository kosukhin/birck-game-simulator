<template>
    <div class="game screen">
        <a @click.prevent="$emit('back')" class="back" href="#">
            {{ $services.lang.t('Back') }} &rarr;
        </a>
        <div v-if="game.isGameOver.value" class="game-over">
            <p>Игра закончена</p>
            <p>Счет: {{ game.score }}</p>
        </div>
        <div class="grid-header">
            Счет:
            {{ game.score }},
            Скорость:
            {{ game.speed }}
        </div>
        <GridView :key="game.updateCounter.value" :grid="game.grid.render()" />
    </div>
</template>

<script setup lang="ts">
import GridView from "~~/src/Components/GridView/GridView.vue";
import { WFMain } from "~~/src/Workflows/Tetris/WFMain";
import HService from "~~/src/Helpers/HService";
import { KeyboardService } from "~~/src/Services/KeyboardService";
import HArray from "~~/src/Helpers/HArray";

const keyboard = HService.get<KeyboardService>('keyboard');
const game = new WFMain();
game.run();

keyboard.clearSubscribers();
keyboard.registerKeySubscriber(key => {
    const shape = game.grid.getFirstShape();

    if (!shape) {
        return;
    }

    if (key === 'w') {
        shape.bitmap = HArray.rotate90(shape.bitmap);
    }

    if (key === 's') {
        shape.y = shape.y + 1;
    }

    if (key === 'a') {
        shape.x = shape.x - 1;
    }

    if (key === 'd') {
        shape.x = shape.x + 1;
    }
});
</script>

<style>
.game-over {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
    padding: 30px;
    background: #f00;
    text-align: center;
    z-index: 2;
    font-weight: bold;
}
</style>
