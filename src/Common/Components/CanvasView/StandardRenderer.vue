<template>
  <canvas ref="canvas" width="0" height="0"></canvas>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { CanvasRenderer } from '~~/src/Common/Library/CanvasRenderer'
import { MGrid } from '~~/src/Common/Models/MGrid'

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
const renderer = new CanvasRenderer(props.grid, props.fps)

onMounted(() => {
  renderer.setCanvas(canvas.value as HTMLCanvasElement)
  renderer.run()
})

onUnmounted(() => {
  renderer.destroy()
})
</script>

<style scoped lang="scss">
canvas {
  border: solid 1px $c_pixel;
}
</style>
