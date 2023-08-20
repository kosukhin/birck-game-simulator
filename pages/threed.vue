<template>
  <div>
    <h1>Змейка 3Д</h1>
    <div
      ref="canvasWrapper"
      :class="'type-' + cameraType + ' direction-' + direction"
    ></div>
    <el-button @click="onChangeCamera('camera1')">Камера 1</el-button>
    <el-button @click="onChangeCamera('camera2')">Камера 2</el-button>
    <el-button @click="onChangeCamera('camera3')">Камера 3</el-button>
  </div>
</template>

<script setup lang="ts">
import { useService } from '~~/src/Common/Helpers/HService'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { SKeyboard } from '~~/src/Common/Services/SKeyboard'
import {
  EMoveDirection,
  EKeyCode,
  KeysToMoveMap,
  KeysToMoveCamera3,
} from '~~/src/Common/Types/GameTypes'
import { WfSnake } from '~~/src/Snake/Workflows/WfSnake'

const cameraType = ref('camera1')
const direction = ref(EMoveDirection.right)
const rserv = new RenderService()
const canvasWrapper = ref()

const game = new WfSnake()
const keyboard = useService<SKeyboard>('keyboard')

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: EKeyCode) => {
  if (KeysToMoveMap[key] !== undefined) {
    let newDirection = KeysToMoveMap[key]

    if (cameraType.value === 'camera3') {
      if (key === EKeyCode.W || key === EKeyCode.S) {
        return
      }

      const currentDirection = game.snake.direction
      newDirection = KeysToMoveCamera3[currentDirection][key]
    }

    direction.value = newDirection
    game.moveSnake(newDirection)
    rserv.setLeadDirection(newDirection)
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

  rserv.setCameraPointId(game.snake.points[game.snake.points.length - 1].id)
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

const onChangeCamera = (type: string) => {
  cameraType.value = type
  if (type in rserv) {
    ;(rserv as any)[type]()
  }
}
</script>

<style lang="scss" scoped>
.type-camera3 {
  transform: rotate(90deg);
}

.type-camera3.direction-1 {
  transform: rotate(180deg);
}

.type-camera3.direction-2 {
  transform: rotate(-90deg);
}

.direction-0 {
  transform: rotate(0deg);
}
</style>
