<template>
  <div class="tetris">
    <component :is="gamesList[action] ?? gamesList.nogame" @grid="onSetGrid" />
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
import load from 'load-script'
import { Platform } from '@element-plus/icons-vue'
import { useService } from '~~/src/common/utils/HService'
import { SHooks } from '~~/src/Common/Services/SHooks'
import NoGame from '~~/src/common/components/Simulator/NoGame.vue'
import { SConfig } from '~~/src/Common/Services/SConfig'
import { MGrid } from '~~/src/common/models/MGrid'

let grid: MGrid | undefined
const gamesList = {
  nogame: NoGame,
}
const configService = useService<SConfig>('config')
let socketTimeInterval = null
const isTranslationStarted = ref(false)

// Заполняем список игр через хук
useService<SHooks>('hooks').gamesResolving.runSubscribers(gamesList)

defineProps({
  action: {
    type: String,
    default: '',
  },
})

const onSetGrid = (newGrid) => {
  grid = newGrid
}

const beginTranslation = () => {
  if (isTranslationStarted.value) {
    stopTranslation()
    return
  }

  isTranslationStarted.value = true
  load(configService.config.socketHttpUrl + 'socket.io/socket.io.js', (err) => {
    if (err) {
      return
    }

    const socket = io(configService.config.socketWsUrl, {})

    socketTimeInterval = setInterval(() => {
      if (!grid) {
        return
      }

      socket.emit('sendMessage', {
        grid: grid.render(),
      })
    }, 300)
  })
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
