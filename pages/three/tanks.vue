<template>
  <div>
    <h1>Танки 3Д</h1>
    <input v-model="rotateX" step="0.1" type="number" />
    <input v-model="rotateY" step="0.1" type="number" />
    <input v-model="rotateZ" step="0.1" type="number" />
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
  KeysToMoveCamera3Tanks,
  KeysToMoveMap,
} from '~~/src/Common/Types/GameTypes'
import { WfTanks } from '~~/src/Tanks/Workflows/WfTanks'

const cameraType = ref('camera1')
const direction = ref(EMoveDirection.down)
const canvasWrapper = ref()
const rserv = new RenderService()
const game = new WfTanks()
const keyboard = useService<SKeyboard>('keyboard')

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: EKeyCode) => {
  if (KeysToMoveMap[key] !== undefined) {
    let newDirection = KeysToMoveMap[key]

    if (cameraType.value === 'camera3') {
      if (key === EKeyCode.S) {
        return
      }

      newDirection = KeysToMoveCamera3Tanks[game.tank.direction][key]
    }

    game.moveTank(newDirection)
  }

  if (key === EKeyCode.SPC) {
    game.shoot()
  }
})

game.run()

const baseSize = 10
rserv.setLeadId('tank_1_0')
rserv.setCameraPointId('tank_1_1')
rserv.setGameSpeed(100)
game.afterNextFrame(() => {
  rserv.setLastUpdateTime(new Date().getTime())
  direction.value = game.tank.direction
  game.shoots.forEach((shoot) => {
    const id = `shoot_${shoot.id}`
    const cube = rserv.cubes[id]

    if (shoot.isDone && cube) {
      cube.visible = false
      return
    }

    rserv.manageCube(
      `shoot_${shoot.id}`,
      shoot.x * baseSize,
      -shoot.y * baseSize,
      0x00aa00
    )
  })

  game.tank.bitmap.forEach((row, rowIndex) => {
    row.forEach((isFilled, cellIndex) => {
      const id = `tank_${cellIndex}_${rowIndex}`
      const cube = rserv.cubes?.[id]
      const cubeExists = rserv.hasCube(id)
      if (isFilled) {
        rserv.manageCube(
          id,
          (game.tank.x + cellIndex) * baseSize,
          (-game.tank.y - rowIndex) * baseSize,
          0xaa0000
        )
        cube && (cube.visible = true)
      } else if (cubeExists) {
        cube.visible = false
      }
    })
  })

  game.bots.forEach((bot) => {
    bot.shoots.forEach((shoot) => {
      const id = `bot_shoot_${shoot.id}`
      const cube = rserv.cubes[id]
      if (shoot.isDone && cube) {
        cube.visible = false
        return
      }
      rserv.manageCube(id, shoot.x * baseSize, -shoot.y * baseSize, 0x0000aa)
    })

    bot.tank.bitmap.forEach((row, rowIndex) => {
      row.forEach((isFilled, cellIndex) => {
        const id = `bot_${bot.type}_${cellIndex}_${rowIndex}`
        const cube = rserv.cubes?.[id]
        const cubeExists = rserv.hasCube(id)

        if (isFilled) {
          rserv.manageCube(
            id,
            (bot.tank.x + cellIndex) * baseSize,
            (-bot.tank.y - rowIndex) * baseSize,
            0xaa0000
          )
          cubeExists && (cube.visible = true)
        } else if (cubeExists) {
          cube.visible = false
        }
      })
    })
  })
})

const k = -50
const rotateY = ref(0)
const rotateX = ref(0)
const rotateZ = ref(0)
rserv.setAfterAnimate((additional: number) => {
  if (rserv.cameraType !== 3) {
    return
  }

  let xMul = 1
  let yMul = 1
  const direction = game.tank.direction

  rotateX.value = 0
  rotateY.value = 0
  rotateZ.value = 0

  if (direction === EMoveDirection.down) {
    yMul = -1
    xMul = 0
    rotateZ.value = 3.15
  }

  if (direction === EMoveDirection.up) {
    xMul = 0
    rotateX.value = 0
    rotateY.value = 0
  }

  if (direction === EMoveDirection.right) {
    yMul = 0.5
    xMul = 1
    rotateX.value = 1.6
    rotateY.value = -0.8
    rotateZ.value = 0
  }

  if (direction === EMoveDirection.left) {
    yMul = 0.5
    xMul = -1
    rotateX.value = 1.6
    rotateY.value = 0.8
    rotateZ.value = 0
  }

  const leadPoint = rserv.cubes[rserv.leadId]

  const temp = new THREE.Vector3()
  rserv.camera.position.lerp(temp, 0.7)
  rserv.camera.position.z = 40
  rserv.camera.position.x = leadPoint.position.x + k * xMul
  rserv.camera.position.y = leadPoint.position.y + k * yMul

  const bot = rserv.cubes.bot_1_0_1
  const pointVector = new THREE.Vector3()
  pointVector.z = 0
  pointVector.x += leadPoint.position.x
  pointVector.y += leadPoint.position.y
  rserv.camera.lookAt(pointVector)
  rserv.camera.rotation.x += Number(rotateX.value)
  rserv.camera.rotation.y += Number(rotateY.value)
  rserv.camera.rotation.z += Number(rotateZ.value)
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
