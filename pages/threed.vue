<template>
  <div>
    <h1>Threed</h1>
    <div ref="canvasWrapper"></div>
  </div>
</template>

<script setup lang="ts">
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'

const rserv = new RenderService()
const canvasWrapper = ref()

onMounted(() => {
  rserv.render(canvasWrapper.value)
})
</script>

<style scoped></style>
