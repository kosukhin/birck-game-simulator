<template>
    <div class="game screen">
        <a class="back" href="#" @click.prevent="$emit('back')">
            {{ $services.lang.t('Back') }} &rarr;
        </a>
        <div v-if="game.isGameOver.value" class="game-over">
            <p>{{ $services.lang.t('Game over') }}</p>
            <p>{{ $services.lang.t('Score') }}: {{ game.score }}</p>
        </div>
        <div class="grid-header">
            {{ $services.lang.t('Score') }}: {{ game.score }},
            {{ $services.lang.t('Speed') }}:
            {{ game.speed }}
        </div>
        <GridView :key="game.updateCounter.value" :grid="game.grid.render()" />
    </div>
</template>

<script setup lang="ts">
import GridView from '~~/src/Components/GridView/GridView.vue'
import { WFMain } from '~~/src/Workflows/Tetris/WFMain'
import { HService } from '~~/src/Helpers/HService'
import { SKeyboard } from '~~/src/Services/SKeyboard'
import { HArray } from '~~/src/Helpers/HArray'

const keyboard = HService.get<SKeyboard>('keyboard')
const game = new WFMain()
game.run()

keyboard.clearSubscribers()
keyboard.registerKeySubscriber((key) => {
    const shape = game.grid.getFirstShape()

    if (!shape) {
        return
    }

    if (key === 'w') {
        shape.bitmap = HArray.rotate90(shape.bitmap)
        game.rerenderGrid()
    }

    if (key === 's') {
        shape.y = shape.y + 1
        game.rerenderGrid()
    }

    if (key === 'a') {
        shape.x = shape.x - 1
        game.rerenderGrid()
    }

    if (key === 'd') {
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
