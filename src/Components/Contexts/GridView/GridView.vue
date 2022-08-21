<template>
    <div class="grid-view-wrapper">
        <div class="grid-view">
            <div v-for="column in grid" class="row">
                <Pixel :filled="pixel" v-for="pixel in column" />
            </div>
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
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    flex-grow: 1;
    overflow: hidden;
}

.row {
    display: flex;
    margin-bottom: 1px;
}

.etalon-pixel {
    opacity: 0;
    position: absolute;
    top: -999px;
    left: -999px;
}
</style>

<style>
.row .pixel {
    margin-right: 1px;
}

.row .pixel:first-child {
    border-left: solid 1px #000200;
}

.row .pixel:last-child {
    border-right: solid 1px #000200;
}

.row:last-child .pixel {
    border-bottom: solid 1px #000200;
}

.row:first-child .pixel {
    border-top: solid 1px #000200;
}
</style>
