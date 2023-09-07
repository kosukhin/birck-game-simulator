<template>
  <div>
    <h1>Бластероид</h1>
    <div ref="canvasWrapper"></div>
  </div>
</template>

<script lang="ts" setup>
import { useService } from '~/src/Common/Helpers/HService'
import { SKeyboard } from '~/src/Common/Services/SKeyboard'
import { WfBlasteroid } from '~/src/Blasteroid/Workflows/WfBlasteroid'
import {
  EKeyCode,
  EMoveDirection,
  KeysToMoveMap,
} from '~/src/Common/Types/GameTypes'
import { RenderService } from '~/src/Common/Library/ThreeD/Services/RenderService'

const canvasWrapper = ref()

const keyboard = useService<SKeyboard>('keyboard')
const game = new WfBlasteroid()
game.run()

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: EKeyCode) => {
  game.move(KeysToMoveMap[key] ?? EMoveDirection.up)

  if (key === EKeyCode.SPC) {
    game.shoot()
  }
})

const baseSize = 10
const rserv = new RenderService()
game.afterNextFrame(() => {
  game.target.bitmap.forEach((row, rowIndex) => {
    row.forEach((isFilled, cellIndex) => {
      const id = `target_${cellIndex}_${rowIndex}`
      const cube = rserv.cubes?.[id]
      const cubeExists = rserv.hasCube(id)
      if (isFilled) {
        rserv.manageCube(
          id,
          (game.target.x + cellIndex) * baseSize,
          (-game.target.y - rowIndex) * baseSize,
          0x00ffff
        )
        cube && (cube.visible = true)
      } else if (cubeExists) {
        cube.visible = false
      }
    })
  })

  game.blasteroid.bitmap.forEach((row, rowIndex) => {
    row.forEach((isFilled, cellIndex) => {
      const id = `blasteroid_${cellIndex}_${rowIndex}`
      const cube = rserv.cubes?.[id]
      const cubeExists = rserv.hasCube(id)
      if (isFilled) {
        rserv.manageCube(
          id,
          (game.blasteroid.x + cellIndex) * baseSize,
          (-game.blasteroid.y - rowIndex) * baseSize,
          0xff0000
        )
        cube && (cube.visible = true)
      } else if (cubeExists) {
        cube.visible = false
      }
    })
  })
})

onMounted(() => {
  rserv.render(canvasWrapper.value)
})
</script>
