<template>
  <div>
    <h1>Threed</h1>
    <div ref="canvasWrapper"></div>
  </div>
</template>

<script setup lang="ts">
import { useService } from '~~/src/Common/Helpers/HService'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { SKeyboard } from '~~/src/Common/Services/SKeyboard'
import { EKeyCode, KeysToMoveMap } from '~~/src/Common/Types/GameTypes'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

const rserv = new RenderService()
const canvasWrapper = ref()

const game = new WfSnake()
const keyboard = useService<SKeyboard>('keyboard')

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: EKeyCode) => {
  if (KeysToMoveMap[key] !== undefined) {
    game.moveSnake(KeysToMoveMap[key])
  }
})

game.run()
const baseSize = 10
game.afterNextFrame(() => {
  const points = [game.target, game.snake.leadPoint, ...game.snake.points]

  points.forEach((point: any) => {
    rserv.manageCube(point.id, point.x * baseSize, -point.y * baseSize)
  })
})

onMounted(() => {
  rserv.render(canvasWrapper.value)
})
</script>
