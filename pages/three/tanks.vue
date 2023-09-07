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
import { MathUtils } from 'three'
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

rserv.afterScene(async () => {
  rserv.scene.background = new THREE.Color('skyblue')
  const textureLoader = new THREE.TextureLoader()
  const texture = await textureLoader.loadAsync('/images/textures/grass.jpg')
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0, 0)
  texture.repeat.set(15, 50)
  const floorGeometry = new THREE.PlaneGeometry(2400, 2400, 100, 1)
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: texture,
  })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.position.set(100, -100, -10)
  rserv.scene.add(floor)
})

const explodeSound = () => rserv.sound('explode', '/sounds/explode.wav')
const shootSound = () => rserv.sound('shoot', '/sounds/shoot.wav', true)

game.addEvent('afterShoot', async () => {
  const sound = await shootSound()
  sound.play()
  sound.setVolume(0.01)
  setTimeout(() => {
    sound.remove()
  }, 300)
})

game.addEvent('hit', async () => {
  const sound = await explodeSound()
  sound.play()
  setTimeout(() => {
    sound.stop()
  }, 500)
})

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
      new THREE.Color('darkorange')
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
          0x111111
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

const k = 50
const rotateY = ref(0)
const rotateX = ref(0)
const rotateZ = ref(0)
const useCustomRotation = ref(false)
const positionZ = ref(90)
const posK = ref(k)
const cameraAngle = ref(0)

const setRotation = ({ x, y, z }: any) => {
  if (useCustomRotation.value) {
    return
  }

  rotateZ.value = z
  rotateX.value = x
  rotateY.value = y
}

rserv.setAfterAnimate(() => {
  if (rserv.cameraType !== 3) {
    return
  }

  const direction = game.tank.direction
  const leadPoint = rserv.cubes[rserv.leadId]

  if (!leadPoint) {
    return
  }

  let x = leadPoint.position.x
  let y = leadPoint.position.y

  setRotation({ x: 0, y: 0, z: 0 })

  if (direction === EMoveDirection.down) {
    y += k
    setRotation({ x: -45, y: 0, z: 180 })
  }

  if (direction === EMoveDirection.up) {
    y -= k
    setRotation({ x: 45, y: 0, z: 0 })
  }

  if (direction === EMoveDirection.right) {
    x -= k
    setRotation({ x: 0, y: -45, z: -90 })
  }

  if (direction === EMoveDirection.left) {
    x += k
    setRotation({ x: 0, y: 45, z: 90 })
  }

  const temp = new THREE.Vector3()
  rserv.camera.position.lerp(temp, 0.7)
  rserv.camera.position.z = positionZ.value
  rserv.camera.position.x = x
  rserv.camera.position.y = y

  rserv.camera.lookAt(leadPoint.position)
  rserv.camera.rotation.x = MathUtils.degToRad(rotateX.value)
  rserv.camera.rotation.y = MathUtils.degToRad(rotateY.value)
  rserv.camera.rotation.z = MathUtils.degToRad(rotateZ.value)
})

onMounted(() => {
  rserv.render(canvasWrapper.value)
  Promise.all([explodeSound(), shootSound()]).then(() => {
    game.run()
  })

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
    onChangeCamera('camera3')
  })
})

const onChangeCamera = (type: string) => {
  cameraType.value = type
  if (type in rserv) {
    ;(rserv as any)[type]()
  }
}
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  flex-direction: row;

  input {
    flex-grow: 1;
  }
}
</style>
