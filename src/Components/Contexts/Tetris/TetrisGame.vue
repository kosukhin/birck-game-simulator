<template>
    <div class="game screen">
        <a @click.prevent="$emit('back')" class="back" href="#">
            {{ $services.lang.t('Back') }} &rarr;
        </a>
        <div v-if="$services.game.isGameOver.value" class="game-over">
            <p>Игра закончена</p>
            <p>Счет: {{ $services.game.score }}</p>
        </div>
        <GridView :key="counter + updateCounter" :grid="$services.grid.getGrid()" />
    </div>
</template>

<script setup>
import GridView from "~~/src/Components/Contexts/GridView/GridView.vue";
import ArrayHelper from '~~/src/Helpers/ArrayHeler';
import ObjectsHelper from "~~/src/Helpers/ObjectsHelper";
import { MainWorkflow } from "~~/src/Workflows/Tetris/MainWorkflow";

const game = new MainWorkflow();
game.run();

const app = useNuxtApp();
app.$services.grid.clearGrid();
const counter = ref(1);
const updateCounter = ref(1);

const nextFrame = () => {
    app.$services.game.nextFrame();
};

// Основной цикл игры
app.$services.game.run(() => {
    const shape = app.$services.grid.getActiveShape();
    const nextStep = app.$services.grid.canGoNextStep();

    app.$services.logger.log('move', 'nuxtStep', nextStep);

    if (!nextStep) {
        app.$services.grid.saveCurrentGrid();
        counter.value = 1;
        app.$services.grid.checkLinesFilled();
        app.$services.game.addRandomShapeToGrid();
        return true;
    }

    counter.value++;

    if (shape) {
        const position = shape.position;
        shape.setPosition(position.x, position.y+1);
    }

    return true;
});

app.$services.keyboard.clearSubscribers();
app.$services.keyboard.registerKeySubscriber(key => {
    const shape = app.$services.grid.getActiveShape();
    const position = shape.position;
    const x = Number(position.x) || 0;
    const y = Number(position.y) || 0;

    if (key === 'w') {
        const grid = ObjectsHelper.clone(shape.grid);
        shape.setBitmap(ArrayHelper.rotate90(grid));
    }

    if (key === 's') {
        position.y = y + 1;
    }

    if (key === 'a') {
        position.x = x - 1;
    }

    if (key === 'd') {
        position.x = x + 1;
    }

    app.$services.logger.log('shape', 'new position', position);
    shape.setPosition(position.x, position.y);
    updateCounter.value++;
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
