<template>
  <div>
    <h1>Бластероид</h1>
    <div ref="canvasWrapper"></div>
  </div>
</template>

<script lang="ts" setup>
import { MathUtils, Vector3 } from 'three'
import * as THREE from 'three'
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
  Object.entries(rserv.cubes).forEach(([id, cube]) => {
    if (id.indexOf('target_') === 0) {
      cube.visible = false
    }
  })

  game.target.bitmap.forEach((row, rowIndex) => {
    row.forEach((isFilled, cellIndex) => {
      const id = `target_${cellIndex}_${rowIndex}`
      const cube = rserv.cubes?.[id]
      const cubeExists = rserv.hasCube(id)
      cube && (cube.visible = false)
      if (isFilled) {
        rserv.manageCube(
          id,
          (game.target.x + cellIndex) * baseSize,
          (-game.target.y - rowIndex) * baseSize,
          0x888888
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

rserv.setAfterAnimate(() => {
  Object.values(game.shoots).forEach((shoot) => {
    const id = `shoot_${shoot.id}`
    const cube = rserv.cubes?.[id]
    if (shoot.willBeRemoved) {
      cube.visible = false
      return
    }
    rserv.manageCube(
      id,
      shoot.x * baseSize,
      -shoot.y * baseSize,
      new THREE.Color('darkorange')
    )
    cube && (cube.visible = true)
  })

  rserv.camera.position.z = 80
  rserv.camera.position.x = (game.blasteroid.x - 3) * baseSize + 40
  rserv.camera.position.y = -game.blasteroid.y * baseSize - 60

  rserv.camera.rotation.x = MathUtils.degToRad(45)
  rserv.camera.rotation.y = MathUtils.degToRad(0)
  rserv.camera.rotation.z = MathUtils.degToRad(0)
})

rserv.afterScene(async () => {
  rserv.scene.background = new THREE.Color('skyblue')
  const textureLoader = new THREE.TextureLoader()
  const texture = await textureLoader.loadAsync('/images/textures/space.jpeg')
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0, 0)
  texture.repeat.set(3, 3)
  const floorGeometry = new THREE.PlaneGeometry(2400, 2400, 100, 1)
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: texture,
  })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.position.set(100, -100, -10)
  rserv.scene.add(floor)
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

  setTimeout(() => {
    rserv.camera3()
  })
})
</script>
