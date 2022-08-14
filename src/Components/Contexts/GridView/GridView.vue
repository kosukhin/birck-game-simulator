<template>
    <div ref="gridView" class="grid-view">
        <div v-for="column in grid" class="row">
            <Pixel :filled="pixel" v-for="pixel in column" />
        </div>
    </div>
</template>

<script setup lang="ts">
import Pixel from "@/src/Components/Contexts/GridView/Pixel.vue";

defineProps({
    grid: {
        type: Array,
        default: () => [[]],
    },
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
}

.etalon-pixel {
    opacity: 0;
    position: absolute;
    top: -999px;
    left: -999px;
}
</style>
