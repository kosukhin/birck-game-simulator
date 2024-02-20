<template>
  <div>
    <div>
      <div ref="canvasWrapper"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import partial from 'lodash/partial'
import { GameGrid } from '~~/src/common/types/Game'
import { Camera } from '~~/src/common/types/Camera'
import { RenderService } from '~/src/common/library/ThreeD/Services/RenderService'
import { EMoveDirection } from '~~/src/common/types/GameTypes'
import { Block } from '~~/src/common/types/Block'
import { Floor } from '~~/src/common/library/floor'
import { onTick, renderTick } from '~~/src/common/library/render'
import { floorTexture } from '~~/src/common/library/constants'

const props = defineProps({
  speed: {
    type: Number,
    default: 400,
  },
  frameCounter: {
    type: Number,
    default: 1,
  },
  blockGroupColor: {
    type: Object as PropType<Record<string, string>>,
    default: () => ({}),
  },
  direction: {
    type: [String, Number] as PropType<EMoveDirection>,
    default: EMoveDirection.right,
  },
  camera: {
    type: Object as PropType<Camera>,
    required: true,
  },
  boundsColor: {
    type: String,
    required: true,
  },
  floorTexture: {
    type: String,
    required: true,
  },
  gameGrid: {
    type: Object as PropType<GameGrid>,
    required: true,
  },
  noAnimation: {
    type: Boolean,
    default: false,
  },
  angles: {
    type: Object as PropType<{ x: number; y: number; z: number }>,
    default: () => null,
  },
})

const renderService = new RenderService()
renderService.applySceneConfig({
  size: [props.gameGrid.gameSize.width, props.gameGrid.gameSize.height],
  background: props.boundsColor,
  soundToEvents: [],
  floor: new Floor(floorTexture, [0, 0], [20, 20], 2400, 2400, 100, 1),
})

const baseSize = 10
const tickHandler = partial(
  renderTick,
  () => props.angles,
  () => props.gameGrid,
  () => renderService,
  () => props.direction,
  () => {
    return props.gameGrid?.blocks.find(
      (block) => block.id === props.camera?.lookToBlockId
    ) as Block
  },
  () => props.camera?.cameraHeightDistance
)

watch(
  () => props.frameCounter,
  () => {
    const cubes: any = { ...renderService.cubes }
    props.gameGrid?.blocks.forEach((block) => {
      cubes[block.id] = false
    })
    Object.entries(cubes).forEach(([id, cube]) => {
      if (cube !== false && id.length > 3) {
        renderService.removeCubeById(id)
      }
    })

    if (props.noAnimation) {
      return
    }

    renderService.setGameSpeed(props.speed)
    renderService.setLastUpdateTime(Date.now())
  }
)

onTick(renderService, (additional: number) => {
  props.gameGrid?.blocks.forEach((block) => {
    renderService.manageCube(
      block.id,
      block.x * baseSize,
      -block.y * baseSize,
      props.blockGroupColor[block.group] ?? '#f00'
    )
  })
  tickHandler(additional)
})

const canvasWrapper = ref<HTMLElement>()
onMounted(() => {
  canvasWrapper.value && renderService.render(canvasWrapper.value)
})
</script>
