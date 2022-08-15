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

const app = useNuxtApp();
app.$services.grid.clearGrid();
const counter = ref(1);
const updateCounter = ref(1);

// Основной цикл игры
app.$services.game.run(() => {
    const nextStep = counter.value < app.$services.grid.getHeight() - 1;

    if (!nextStep) {
        app.$services.grid.saveCurrentGrid();
        counter.value = 1;
        return true;
    }

    counter.value++;

    if (app.$services.grid.getActiveShape()) {
        const shape = app.$services.grid.getActiveShape();
        const position = shape.position;
        shape.setPosition(position.x, position.y+1);

        console.log(shape);
    }

    return true;
});

app.$services.keyboard.clearSubscribers();
app.$services.keyboard.registerKeySubscriber(key => {
    const shape = app.$services.grid.getActiveShape();
    const position = shape.position;
    const x = Number(position.x) || 0;
    const y = Number(position.y) || 0;

    if (key === 's') {
        console.log('down');
        position.y = y + 1;
    }

    if (key === 'a') {
        console.log('left');
        position.x = x - 1;
    }

    if (key === 'd') {
        console.log('right');
        position.x = x + 1;
    }

    shape.setPosition(position.x, position.y);
    updateCounter.value++;
});
</script>
