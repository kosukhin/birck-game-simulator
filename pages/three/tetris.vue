<template>
  <div>
    <h1>Тетрис 3д</h1>
    <div ref="canvasWrapper"></div>
  </div>
</template>

<script lang="ts" setup>
import { useService } from '~/src/Common/Helpers/HService'
import { SKeyboard } from '~/src/Common/Services/SKeyboard'
import { WfTetris } from '~/src/Tetris/Workflows/WfTetris'
import { EKeyCode } from '~/src/Common/Types/GameTypes'
import { RenderService } from '~/src/Common/Library/ThreeD/Services/RenderService'

const baseSize = 10
const canvasWrapper = ref()
const keyboard = useService<SKeyboard>('keyboard')
const game = new WfTetris()
const rserv = new RenderService()
game.run()

keyboard.clearSubscribers()
keyboard.registerSubscriber((key: EKeyCode) => {
  const shape = game.grid.getFirstShape()

  if (!shape) {
    return
  }

  if (key === EKeyCode.W) {
    game.rotateShape()
  }

  if (key === EKeyCode.S) {
    game.moveShapeDown()
  }

  if (key === EKeyCode.A) {
    game.moveShapeByX(-1)
  }

  if (key === EKeyCode.D) {
    game.moveShapeByX(1)
  }
})

game.afterNextFrame(() => {
  Object.entries(rserv.cubes).forEach(([id, cube]) => {
    if (id.indexOf('target_') === 0 || id.indexOf('bg_') === 0) {
      cube.visible = false
    }
  })

  const shape = game.grid.getFirstShape()
  if (shape) {
    shape.bitmap.forEach((row, rowIndex) => {
      row.forEach((isFilled, cellIndex) => {
        const id = `target_${cellIndex}_${rowIndex}`
        const cube = rserv.cubes?.[id]
        const cubeExists = rserv.hasCube(id)

        if (isFilled) {
          rserv.manageCube(
            id,
            (shape.x + cellIndex) * baseSize,
            (-shape.y - rowIndex) * baseSize,
            0xaa0000
          )
          cubeExists && (cube.visible = true)
        } else if (cubeExists) {
          cube.visible = false
        }
      })
    })
  }

  game.grid.bgBitmap.forEach((row, rowIndex) => {
    row.forEach((isFilled, cellIndex) => {
      const id = `bg_${cellIndex}_${rowIndex}`
      const cube = rserv.cubes?.[id]
      const cubeExists = rserv.hasCube(id)

      if (isFilled) {
        rserv.manageCube(
          id,
          cellIndex * baseSize,
          -rowIndex * baseSize,
          0xaa0000
        )
        cubeExists && (cube.visible = true)
      } else if (cubeExists) {
        cube.visible = false
      }
    })
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
</script>
