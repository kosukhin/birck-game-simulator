<template>
  <div class="canvas-view">
    <el-switch
      v-model="useThreeJs"
      :active-text="$services.lang.t('Use 3D')"
      active-color="#13ce66"
      class="canvas-view__switch"
      inactive-color="#ff4949"
      @input="changeUseTreeJs"
    >
    </el-switch>
    <div class="canvas-view__renderer">
      <standard-renderer v-if="!useThreeJs" :fps="fps" :grid="grid" />
      <three-renderer v-else :fps="fps" :grid="grid" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import StandardRenderer from '~~/src/Common/Components/CanvasView/StandardRenderer.vue'
import { MGrid } from '~~/src/Common/Models/MGrid'
import { useService } from '~~/src/Common/Helpers/HService'
import { SCookies } from '~~/src/Common/Services/SCookies'
import ThreeRenderer from '~~/src/Common/Components/CanvasView/ThreeRenderer.vue'

defineProps({
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

const cookieService = useService<SCookies>('cookies')
const useThreeJs = ref(cookieService.get('useThreeJs') === 'true')

const changeUseTreeJs = () => {
  cookieService.set('useThreeJs', useThreeJs.value.toString())
}
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
