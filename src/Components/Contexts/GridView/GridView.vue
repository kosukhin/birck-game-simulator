<template>
    <div ref="gridView" class="grid-view">
        <Pixel class="etalon-pixel" ref="etalonPixel" />
        <Pixel v-for="_ in pixelsCount" />
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "#imports";
import Pixel from "@/src/Components/Contexts/GridView/Pixel.vue";

const gridView = ref(null);
const etalonPixel = ref(null);
const pixelsCount = ref(1);

onMounted(() => {
    const gridElement = gridView.value as HTMLElement;
    const {clientHeight, clientWidth} = gridElement;
    const etalonPixelElement = etalonPixel.value as any;
    // +2 потому что границы есть
    const pixelSize = etalonPixelElement.$el.clientHeight + 3;
    const {floor} = Math;

    pixelsCount.value = floor(clientWidth / pixelSize) * floor(clientHeight / pixelSize);
});
</script>

<style scoped>
.grid-view {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    flex-grow: 1;
    overflow: hidden;
    gap: 1px;
}

.etalon-pixel {
    opacity: 0;
    position: absolute;
    top: -999px;
    left: -999px;
}
</style>
