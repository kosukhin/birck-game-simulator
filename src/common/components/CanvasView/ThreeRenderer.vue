<template>
  <div class="three-renderer">
    <div ref="canvas" class="three-renderer__canvas-wrapper"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { MGrid } from '~~/src/common/models/MGrid'
import { ThreeJsRenderer } from '~~/src/common/library/ThreeJsRenderer'

const props = defineProps({
  grid: {
    required: true,
    type: Object as () => MGrid,
  },
  fps: {
    required: true,
    type: Number,
    default: 5,
  },
})

const canvas = ref()

onMounted(() => {
  const renderer = new ThreeJsRenderer(props.grid, canvas.value)
  renderer.render()
})
</script>

<style lang="scss">
canvas {
  border: solid 1px $c_pixel;
  background: $c_tetris_screen;
}
</style>
