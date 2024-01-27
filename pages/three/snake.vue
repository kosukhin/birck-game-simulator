<template>
  <div>
    <RouterLink to="/simulator/snake/">Классическая змейка</RouterLink>
    <h1>Змейка 3Д</h1>
    <ThreeDView
      :speed="settings.speed"
      :camera="camera"
      :game-grid="gameGrid"
      :block-group-color="blockGroupColor"
      floor-texture="/hello.jpg"
      bounds-color="#ccc"
      :direction="direction"
    />
    <KeyboardHint @pause="game.pause()" />
  </div>
</template>

<script setup lang="ts">
import partial from 'lodash/partial'
import KeyboardHint from '~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import ThreeDView from '~/src/Common/Components/ThreeDView/ThreeDView.vue'
import { GameGrid, GameSettings } from '~/src/Common/cpu/providers/types/Game'
import { useSnake } from '~/src/Snake/cpu/composables/useSnake'
import { refState } from '~/src/Common/cpu/utils/state'
import { timer } from '~/src/Common/cpu/utils/timer'
import { useService } from '~/src/Common/Helpers/HService'
import { SKeyboard } from '~/src/Common/Services/SKeyboard'
import { EKeyCode } from '~/src/Common/Types/GameTypes'
import { Camera } from '~/src/Common/cpu/providers/types/Camera'
import { handleKey } from '~/app/hofs/snake/handleKey'

const settings = ref<GameSettings>({
  isGameOver: false,
  score: 0,
  speed: 300,
  isPaused: false,
})
const gameGrid = ref<GameGrid>({
  blocks: [],
  gameSize: {
    height: 15,
    width: 15,
  },
})
const snakeActions = useSnake(
  partial(refState, settings),
  partial(refState, gameGrid),
  timer
)
snakeActions.start()

const direction = ref(snakeActions.getDirection())
// FIXME переделать сервис убрать
const keyboard = useService<SKeyboard>('keyboard')
keyboard.clearSubscribers()
keyboard.registerSubscriber((key: EKeyCode) => {
  handleKey(() => key, snakeActions.getDirection, snakeActions.changeDirection)
  direction.value = snakeActions.getDirection()
})

const blockGroupColor = {
  target: '#25ff25',
  lead: '#cd0000',
  tail: '#ff2c2c',
}
const camera: Camera = {
  cameraHeightDistance: 60,
  lookFromBlockId: 'tail1',
  lookToBlockId: 'lead',
}
</script>
