<template>
    <div class="game screen">
        <div v-if="game.isGameOver.value" class="game-over">
            <el-result
                icon="error"
                :title="$services.lang.t('Game over')"
                :sub-title="`${$services.lang.t('Score')}: ${game.score.value}`"
            />
        </div>
        <div class="grid-header">
            {{ $services.lang.t('Score') }}: {{ game.score }}
        </div>
        <CanvasView :grid="game.grid" :fps="20" />
        <KeyboardHint @pause="onPaused">
            <SpaceHint />
            <br />
        </KeyboardHint>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import SpaceHint from '../../../Common/Components/KeyboardHint/SpaceHint.vue'
import { useService } from '~~/src/Common/Helpers/HService'
import { SKeyboard } from '~~/src/Common/Services/SKeyboard'
import { WfTanks } from '~~/src/Tanks/Workflows/WfTanks'
import { KeysToMoveMap, EKeyCode } from '~~/src/Common/Types/GameTypes'
import CanvasView from '~~/src/Common/Components/CanvasView/CanvasView.vue'
import KeyboardHint from '~~/src/Common/Components/KeyboardHint/KeyboardHint.vue'

const keyboard = useService<SKeyboard>('keyboard')
const game = new WfTanks()
game.run()

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: EKeyCode) => {
    if (KeysToMoveMap[key] !== undefined) {
        game.moveTank(KeysToMoveMap[key])
    }

    if (key === EKeyCode.SPC) {
        game.shoot()
    }
})

const emit = defineEmits(['grid'])
onMounted(() => {
    emit('grid', game.grid)
})

const onPaused = () => {
    game.pause()
}
</script>
