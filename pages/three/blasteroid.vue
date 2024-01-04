<template>
  <div>
    <h1>Бластероид</h1>
    <div ref="canvasWrapper"></div>
    <KeyboardHint @pause="game.pause">
      <SpaceHint />
      <br />
    </KeyboardHint>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { MathUtils } from 'three'
import { WfBlasteroid } from '~/src/Blasteroid/Workflows/WfBlasteroid'
import KeyboardHint from '~/src/Common/Components/KeyboardHint/KeyboardHint.vue'
import SpaceHint from '~/src/Common/Components/KeyboardHint/SpaceHint.vue'
import { cubesGroupExtract } from '~/src/Common/Functions/cubesGroupExtract'
import { cubesToInvisible } from '~/src/Common/Functions/cubesToInvisible'
import { useService } from '~/src/Common/Helpers/HService'
import { RenderService } from '~/src/Common/Library/ThreeD/Services/RenderService'
import { SKeyboard } from '~/src/Common/Services/SKeyboard'
import {
  EKeyCode,
  EMoveDirection,
  KeysToMoveMap,
} from '~/src/Common/Types/GameTypes'

const canvasWrapper = ref()

const keyboard = useService<SKeyboard>('keyboard')

const game = new WfBlasteroid()
const rserv = new RenderService()

game.run()

keyboard.clearSubscribers()
// set keyboard handler
keyboard.registerSubscriber((key: EKeyCode) => {
  game.move(KeysToMoveMap[key] ?? EMoveDirection.up)

  if (key === EKeyCode.SPC) {
    game.shoot()
  }
})

// set canvas constants
const baseSize = 10
game.afterNextFrame(() => {
  cubesGroupExtract(rserv.cubes, 'target_').forEach(cubesToInvisible)

  // отображение битмапа цели на кубы сервиса
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

  // отображение бластероида на кубы
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
  // Отображение куба выстрела
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

  // Настройка камеры
  rserv.camera.position.z = 80
  rserv.camera.position.x = (game.blasteroid.x - 3) * baseSize + 40
  rserv.camera.position.y = -game.blasteroid.y * baseSize - 60

  rserv.camera.rotation.x = MathUtils.degToRad(45)
  rserv.camera.rotation.y = MathUtils.degToRad(0)
  rserv.camera.rotation.z = MathUtils.degToRad(0)
})

rserv.afterScene(async () => {
  // Рендеринг пола
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

// Привязка звука выстрела
const explodeSound = () => rserv.sound('explode', '/sounds/explode.wav')

game.afterTargetBeated(async () => {
  const sound = await explodeSound()
  sound.play()
  setTimeout(() => {
    sound.stop()
  }, 500)
})

onMounted(() => {
  rserv.render(canvasWrapper.value)

  setTimeout(() => {
    rserv.camera3()
  })
})
</script>
