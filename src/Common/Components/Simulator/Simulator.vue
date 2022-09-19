<template>
    <div class="tetris">
        <component
            :is="gamesList[action] ?? gamesList.nogame"
            @grid="onSetGrid"
        />
        <div class="button-wrapper">
            <el-button
                :type="isTranslationStarted ? 'danger' : 'primary'"
                :icon="Platform"
                round
                @click="beginTranslation"
            >
                <template v-if="isTranslationStarted">
                    {{ $services.lang.t('End the broadcast') }}
                </template>
                <template v-else>
                    {{ $services.lang.t('Start broadcasting') }}
                </template>
            </el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import load from 'load-script'
import { Platform } from '@element-plus/icons-vue'
import { useService } from '~~/src/Common/Helpers/HService'
import { SHooks } from '~~/src/Common/Services/SHooks'
import NoGame from '~~/src/Common/Components/Simulator/NoGame.vue'
import { SConfig } from '~~/src/Common/Services/SConfig'
import { MGrid } from '~~/src/Common/Models/MGrid'

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
    load(
        configService.config.socketHttpUrl + 'socket.io/socket.io.js',
        (err) => {
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
        }
    )
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
}

.button-wrapper {
    padding-top: 20px;
    text-align: center;
}
</style>
