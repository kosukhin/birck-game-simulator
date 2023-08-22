<template>
  <div>
    <h1>Танки 3Д</h1>
    <div
      ref="canvasWrapper"
      :class="'type-' + cameraType + ' direction-' + direction"
    ></div>
    <el-button @click="onChangeCamera('camera1')">Камера 1</el-button>
    <el-button @click="onChangeCamera('camera2')">Камера 2</el-button>
    <el-button @click="onChangeCamera('camera3')">Камера 3</el-button>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { useService } from '~~/src/Common/Helpers/HService'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { SKeyboard } from '~~/src/Common/Services/SKeyboard'
import {
  EKeyCode,
  EMoveDirection,
  KeysToMoveMap,
} from '~~/src/Common/Types/GameTypes'
import { WfTanks } from '~~/src/Tanks/Workflows/WfTanks'

const cameraType = ref('camera1')
const canvasWrapper = ref()
const rserv = new RenderService()
const game = new WfTanks()
const keyboard = useService<SKeyboard>('keyboard')

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: EKeyCode) => {
  if (KeysToMoveMap[key] !== undefined) {
    game.moveTank(KeysToMoveMap[key])
  }

  if (key === EKeyCode.SPC) {
    game.shoot()
  }
})

game.run()

let counter = 0
const baseSize = 10
rserv.setLeadId('tank_1_0')
rserv.setCameraPointId('tank_1_1')
game.afterNextFrame(() => {
  counter++

  game.shoots.forEach((shoot) => {
    rserv.manageCube(
      `shoot_${shoot.id}`,
      shoot.x * baseSize,
      -shoot.y * baseSize,
      0x00aa00
    )
  })

  game.tank.bitmap.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell) {
        rserv.manageCube(
          `tank_${cellIndex}_${rowIndex}`,
          (game.tank.x + cellIndex) * baseSize,
          (-game.tank.y - rowIndex) * baseSize,
          0xaa0000
        )
      }
    })
  })

  game.bots.forEach((bot) => {
    bot.shoots.forEach((shoot) => {
      rserv.manageCube(
        `bot_shoot_${shoot.id}`,
        shoot.x * baseSize,
        -shoot.y * baseSize,
        0x0000aa
      )
    })

    bot.tank.bitmap.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell) {
          rserv.manageCube(
            `bot_${bot.id}_${cellIndex}_${rowIndex}`,
            (bot.tank.x + cellIndex) * baseSize,
            (-bot.tank.y - rowIndex) * baseSize,
            0xaa0000
          )
        }
      })
    })
  })

  rserv.setAfterAnimate((additional: number) => {
    if (rserv.cameraType !== 3) {
      return
    }

    let xMul = 1
    let yMul = 1
    const direction = game.tank.direction

    if (direction === EMoveDirection.down) {
      yMul = -1
      xMul = 0
    }

    if (direction === EMoveDirection.up) {
      xMul = 0
    }

    if (direction === EMoveDirection.right) {
      yMul = 0
      xMul = 1
    }

    if (direction === EMoveDirection.left) {
      yMul = 0
      xMul = -1
    }

    const cameraPoint = rserv.cubes[rserv.cameraPointId]

    const temp = new THREE.Vector3()
    rserv.camera.position.lerp(temp, 0.7)
    rserv.camera.position.z = 328
    rserv.camera.position.x =
      cameraPoint.position.x + additional * baseSize * xMul
    rserv.camera.position.y =
      cameraPoint.position.y + additional * baseSize * yMul
    const leadPoint = rserv.cubes[rserv.leadId]

    const pointVector = new THREE.Vector3()
    pointVector.x += leadPoint.position.x + additional * baseSize * xMul
    pointVector.y += leadPoint.position.y + additional * baseSize * yMul
    rserv.camera.lookAt(pointVector)
  })
})

onMounted(() => {
  rserv.render(canvasWrapper.value)

  const width = game.grid.width
  const height = game.grid.height
  const white = 0xffffff

  for (let i = 0; i < width; i++) {
    rserv.createCube('top' + i, i * baseSize, 1 * baseSize, white)
    rserv.createCube('bottom' + i, i * baseSize, -height * baseSize, white)
  }

  for (let i = 0; i < height; i++) {
    rserv.createCube('left' + i, -1 * baseSize, -i * baseSize, white)
    rserv.createCube('right' + i, width * baseSize, -i * baseSize, white)
  }
})

const onChangeCamera = (type: string) => {
  cameraType.value = type
  if (type in rserv) {
    ;(rserv as any)[type]()
  }
}
</script>
