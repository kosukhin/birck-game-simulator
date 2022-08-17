<template>
    <div class="game screen">
        <a @click.prevent="$emit('back')" class="back" href="#">
            {{ $services.lang.t('Back') }} &rarr;
        </a>
        <GridView :key="counter + updateCounter" :grid="$services.grid.getGrid()" />
    </div>
</template>

<script setup>
import GridView from "~~/src/Components/Contexts/GridView/GridView.vue";
import ArrayHelper from '~~/src/Helpers/ArrayHeler';

const app = useNuxtApp();
app.$services.grid.clearGrid();
const counter = ref(1);
const updateCounter = ref(1);

// Основной цикл игры
app.$services.game.run(() => {
    const shape = app.$services.grid.getActiveShape();
    const nextStep = app.$services.grid.canGoNextStep();

    app.$services.logger.log('move', 'nuxtStep', nextStep);

    if (!nextStep) {
        app.$services.grid.saveCurrentGrid();
        counter.value = 1;
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
        const grid = shape.grid;
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
