<template>
  <div class="canvas-view">
    <div class="canvas-view__renderer">
      <standard-renderer :fps="fps" :grid="grid" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import StandardRenderer from '~~/src/common/components/CanvasView/StandardRenderer.vue'
import { MGrid } from '~~/src/common/models/MGrid'

defineProps({
  grid: {
    required: true,
    type: Object as PropType<MGrid>,
  },
  fps: {
    required: true,
    type: Number,
    default: 5,
  },
})
</script>

<style lang="scss" scoped>
canvas {
  border: solid 1px $c_pixel;
  background: $c_tetris_screen;
}

.canvas-view {
  &__renderer {
    display: flex;
    justify-content: center;
  }
}
</style>
