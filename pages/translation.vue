<template>
    <div>
        <h1>
            {{ $services.lang.t('Game Broadcast Online') }}
        </h1>
        <div class="game screen">
            <CanvasView :key="canvasKey" :grid="grid" :fps="10" />
        </div>
        <blockquote>
            {{
                $services.lang.t(
                    'Here you can watch someone playing Brick Game'
                )
            }}
        </blockquote>
    </div>
</template>

<script setup lang="ts">
import load from 'load-script'
import CanvasView from '~~/src/Common/Components/CanvasView/CanvasView.vue'
import { useService } from '~~/src/Common/Helpers/HService'
import { SConfig } from '~~/src/Common/Services/SConfig'
import { MGrid } from '~~/src/Common/Models/MGrid'

const grid = new MGrid({})
const canvasKey = ref('translation')

const configService = useService<SConfig>('config')
onMounted(() => {
    load(
        configService.config.socketHttpUrl + 'socket.io/socket.io.js',
        (err) => {
            if (err) {
                return
            }

            const socket = window.io(configService.config.socketWsUrl, {})
            socket.on('receiveMessage', (args) => {
                if (!args.grid) {
                    return
                }

                grid.setGrid(args.grid)
                grid.setHeight(args.grid.length)
                grid.setWidth(args.grid[0].length)
                canvasKey.value = `${grid.height}_${grid.width}`
            })
        }
    )
})
</script>
