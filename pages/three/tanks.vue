<template>
  <h1>Танки 3Д</h1>
  <div
    ref="canvasWrapper"
    :class="'type-' + cameraType + ' direction-' + direction"
  ></div>
</template>

<script lang="ts" setup>
import { useService } from '~~/src/Common/Helpers/HService'
import { RenderService } from '~~/src/Common/Library/ThreeD/Services/RenderService'
import { SKeyboard } from '~~/src/Common/Services/SKeyboard'
import { EKeyCode, KeysToMoveMap } from '~~/src/Common/Types/GameTypes'
import { WfTanks } from '~~/src/Tanks/Workflows/WfTanks'

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

const baseSize = 10
game.afterNextFrame(() => {
  game.tank.bitmap.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell) {
        rserv.manageCube(
          `tank_${cellIndex}_${rowIndex}`,
          (game.tank.x + cellIndex) * baseSize,
          (-game.tank.y + rowIndex) * baseSize,
          0xaa0000
        )
      }
    })
  })

  game.bots.forEach((bot) => {
    bot.tank.bitmap.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell) {
          rserv.manageCube(
            `bot_${bot.id}_${cellIndex}_${rowIndex}`,
            (bot.tank.x + cellIndex) * baseSize,
            (-bot.tank.y + rowIndex) * baseSize,
            0xaa0000
          )
        }
      })
    })
  })
})

onMounted(() => {
  rserv.render(canvasWrapper.value)
})
</script>
