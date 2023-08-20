<template>
  <div>
    <el-input
      v-model="fav"
      type="number"
      @input="rserv.camera3(fav, rx, ry, z)"
    />
    <el-input
      v-model="rx"
      type="number"
      step="0.1"
      @input="rserv.camera3(fav, rx, ry, z)"
    />
    <el-input
      v-model="ry"
      type="number"
      step="0.1"
      @input="rserv.camera3(fav, rx, ry, z)"
    />
    <el-input
      v-model="z"
      type="number"
      step="1"
      @input="rserv.camera3(fav, rx, ry, z)"
    />
    <h1>Змейка 3Д</h1>
    <div ref="canvasWrapper"></div>
    <el-button @click="rserv.camera1()">Камера 1</el-button>
    <el-button @click="rserv.camera2()">Камера 2</el-button>
    <el-button @click="rserv.camera3()">Камера 3</el-button>
  </div>
</template>

<script setup lang="ts">
import { useService } from '~~/src/Common/Helpers/HService'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { SKeyboard } from '~~/src/Common/Services/SKeyboard'
import { EKeyCode, KeysToMoveMap } from '~~/src/Common/Types/GameTypes'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

const fav = ref(30)
const rx = ref(0)
const ry = ref(0)
const z = ref(150)
const rserv = new RenderService()
const canvasWrapper = ref()

const game = new WfSnake()
const keyboard = useService<SKeyboard>('keyboard')

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: EKeyCode) => {
  if (KeysToMoveMap[key] !== undefined) {
    game.moveSnake(KeysToMoveMap[key])
    rserv.setLeadDirection(KeysToMoveMap[key])
  }
})

game.run()
const baseSize = 10
rserv.setLeadId('leadPoint')
game.afterNextFrame(() => {
  rserv.manageCube(
    game.target.id,
    game.target.x * baseSize,
    -game.target.y * baseSize,
    0x00aa00
  )

  rserv.manageCube(
    'leadPoint',
    game.snake.leadPoint.x * baseSize,
    -game.snake.leadPoint.y * baseSize,
    0xaa0000
  )

  game.snake.points.forEach((point: any) => {
    rserv.manageCube(
      point.id,
      point.x * baseSize,
      -point.y * baseSize,
      0x8888ff
    )
  })

  rserv.calculateCameraPosition()
})

onMounted(() => {
  rserv.render(canvasWrapper.value)
  const width = game.grid.width
  const height = game.grid.height
  const red = 0xff0000
  const green = 0x00ff00
  const blue = 0x0000ff
  const white = 0xffffff

  for (let i = 0; i < width; i++) {
    rserv.createCube('top' + i, i * baseSize, 1 * baseSize, red)
    rserv.createCube('bottom' + i, i * baseSize, -height * baseSize, white)
  }

  for (let i = 0; i < height; i++) {
    rserv.createCube('left' + i, -1 * baseSize, -i * baseSize, green)
    rserv.createCube('right' + i, width * baseSize, -i * baseSize, blue)
  }
})
</script>
