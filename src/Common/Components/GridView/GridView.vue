<template>
    <div class="grid-view-wrapper">
        <div class="grid-view">
            <div
                v-for="(column, columnIndex) in grid"
                :key="`column_${columnIndex}`"
                class="row"
            >
                <Pixel
                    v-for="(pixel, pixelIndex) in column"
                    :key="`pixel_${pixelIndex}`"
                    :filled="pixel"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Pixel from '~~/src/Common/Components/GridView/Pixel.vue'

defineProps({
    grid: {
        type: Array,
        default: () => [[]],
    },
})
</script>

<style scoped>
.grid-view {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column wrap;
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

<style lang="scss">
.row .pixel {
    margin-right: 1px;
}

.row .pixel:first-child {
    border-left: solid 1px $c_pixel;
}

.row .pixel:last-child {
    border-right: solid 1px $c_pixel;
}

.row:last-child .pixel {
    border-bottom: solid 1px $c_pixel;
}

.row:first-child .pixel {
    border-top: solid 1px $c_pixel;
}
</style>
