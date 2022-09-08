<template>
    <div class="game screen">
        <nuxt-link class="back" to="/simulator/">
            {{ $services.lang.t('Back') }} &rarr;
        </nuxt-link>
        <div v-if="game.isGameOver.value" class="game-over">
            <p>{{ $services.lang.t('Game over') }}</p>
            <p>{{ $services.lang.t('Score') }}: {{ game.score }}</p>
        </div>
        <div class="grid-header">
            {{ $services.lang.t('Score') }}: {{ game.score }},
            {{ $services.lang.t('Speed') }}:
            {{ game.speed }}
        </div>
        <CanvasView :grid="game.grid" :fps="10" />
    </div>
</template>

<script setup lang="ts">
import { WfTetris } from '~~/src/Tetris/Workflows/WfTetris'
import { useService } from '~~/src/Common/Helpers/HService'
import { KeyCode, SKeyboard } from '~~/src/Common/Services/SKeyboard'
import { HArray } from '~~/src/Common/Helpers/HArray'
import CanvasView from '~~/src/Common/Components/CanvasView/CanvasView.vue'

const keyboard = useService<SKeyboard>('keyboard')
const game = new WfTetris()
game.run()

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: KeyCode) => {
    const shape = game.grid.getFirstShape()

    if (!shape) {
        return
    }

    if (key === KeyCode.W) {
        shape.bitmap = HArray.rotate90(shape.bitmap)
        game.rerenderGrid()
    }

    if (key === KeyCode.S) {
        shape.y = shape.y + 1
        game.rerenderGrid()
    }

    if (key === KeyCode.A) {
        shape.x = shape.x - 1
        game.rerenderGrid()
    }

    if (key === KeyCode.D) {
        shape.x = shape.x + 1
        game.rerenderGrid()
    }
})
</script>

<style lang="scss" scoped>
.game-over {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
    padding: 30px;
    background: $c_red;
    text-align: center;
    z-index: 2;
    font-weight: bold;
}
</style>
