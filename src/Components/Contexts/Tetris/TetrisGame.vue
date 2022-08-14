<template>
    <div class="game screen">
        <a @click.prevent="$emit('back')" class="back" href="#">
            {{ $services.lang.t('Back') }} &rarr;
        </a>
        <GridView :grid="$services.grid.getGrid()" />
    </div>
</template>

<script setup>
import GridView from "~~/src/Components/Contexts/GridView/GridView.vue";

const width = ref(10);
const height = ref(11);
const app = useNuxtApp();

app.$services.keyboard.clearSubscribers();
app.$services.keyboard.registerKeySubscriber(key => {
    if (key === 'w') {
        console.log('up');
    }

    if (key === 's') {
        console.log('down');
    }

    if (key === 'a') {
        console.log('left');
    }

    if (key === 'd') {
        console.log('right');
    }
});
</script>
