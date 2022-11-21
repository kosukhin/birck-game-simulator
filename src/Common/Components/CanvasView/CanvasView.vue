<template>
    <div class="canvas-view">
        <el-switch
            v-model="useThreeJs"
            class="canvas-view__switch"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-text="$services.lang.t('Use 3D')"
            @input="changeUseTreeJs"
        >
        </el-switch>
        <div class="canvas-view__renderer">
            <standard-renderer v-if="!useThreeJs" :grid="grid" :fps="fps" />
            <three-renderer v-else :grid="grid" :fps="fps" />
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

<style scoped lang="scss">
canvas {
    border: solid 1px $c_pixel;
    background: $c_tetris_screen;
}

.canvas-view {
    &__switch {
        display: block;
    }

    &__renderer {
        display: flex;
        justify-content: center;
    }
}
</style>
