<template>
  <div class="tetris">
    <div class="button-wrapper">
      <el-button
        :icon="Platform"
        :type="isTranslationStarted ? 'danger' : 'primary'"
        round
        @click="beginTranslation"
      >
        <template v-if="isTranslationStarted">
          {{ 'End the broadcast' }}
        </template>
        <template v-else>
          {{ 'Start broadcasting' }}
        </template>
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Platform } from '@element-plus/icons-vue'

const socketTimeInterval: any = null
const isTranslationStarted = ref(false)

defineProps({
  action: {
    type: String,
    default: '',
  },
})

const beginTranslation = () => {
  if (isTranslationStarted.value) {
    stopTranslation()
  }
}

const stopTranslation = () => {
  isTranslationStarted.value = false
  socketTimeInterval && clearInterval(socketTimeInterval)
}

onUnmounted(() => {
  socketTimeInterval && clearInterval(socketTimeInterval)
})
</script>

<style lang="scss" scoped>
.tetris {
  display: inline-block;
  position: relative;

  @include media648 {
    margin: 0 auto;
  }
}

.button-wrapper {
  padding-top: 20px;
  text-align: center;
}
</style>
