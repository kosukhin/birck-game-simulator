<template>
    <div class="three-renderer">
        <div ref="canvas" class="three-renderer__canvas-wrapper"></div>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { onMounted } from 'vue'
import { MGrid } from '~/src/Common/Models/MGrid'

const props = defineProps({
    grid: {
        required: true,
        type: Object as () => MGrid,
    },
    fps: {
        required: true,
        type: Number,
        default: 5,
    },
})

const canvas = ref()
const baseSize = 20
const spaceBetween = 9

const initThreeJs = () => {
    let gridArray = props.grid.render()
    const height = (gridArray.length + 1) * (baseSize + spaceBetween)
    const width = (gridArray[0].length + 1) * (baseSize + spaceBetween)
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(
        width / -2,
        width / 2,
        height / 2,
        height / -2,
        -baseSize,
        1000
    )
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        background: 'none',
    })
    renderer.setSize(width, height)
    canvas.value.appendChild(renderer.domElement)

    const geometry = new THREE.BoxGeometry(baseSize, baseSize, baseSize)
    const material = new THREE.MeshLambertMaterial({
        color: 0x666666,
    })

    const cubesGrid = []
    let topOffset = -1 * (baseSize + spaceBetween)
    let leftOffset = 0

    const light = new THREE.AmbientLight(0xffffff, 1)
    scene.add(light)

    for (const row in gridArray) {
        gridArray[row].reverse()

        if (!cubesGrid[row]) {
            cubesGrid[row] = []
        }

        for (const cell in gridArray[row]) {
            leftOffset += baseSize + spaceBetween
            cubesGrid[row][cell] = new THREE.Mesh(geometry, material)
            cubesGrid[row][cell].position.x = leftOffset - width / 2
            cubesGrid[row][cell].position.y = topOffset + height / 2
            scene.add(cubesGrid[row][cell])
            cubesGrid[row][cell].visible = false
        }

        topOffset -= baseSize + spaceBetween
        leftOffset = 0
    }

    camera.position.z = 5
    let rotationX = 0
    let rotationY = 0

    function animate() {
        requestAnimationFrame(animate)
        gridArray = props.grid.render()

        rotationX += 0.01
        rotationY += 0.01

        for (const row in gridArray) {
            for (const cell in gridArray[row]) {
                cubesGrid[row][cell].visible = false

                if (gridArray[row][cell]) {
                    cubesGrid[row][cell].visible = true

                    if (!cubesGrid[row][cell].rotation.x) {
                        cubesGrid[row][cell].rotation.x = rotationX
                        cubesGrid[row][cell].rotation.y = rotationY
                    } else {
                        cubesGrid[row][cell].rotation.x += 0.01
                        cubesGrid[row][cell].rotation.y += 0.01
                    }
                }
            }
        }

        renderer.render(scene, camera)
    }
    animate()
}

onMounted(initThreeJs)
</script>

<style lang="scss">
canvas {
    border: solid 1px $c_pixel;
    background: $c_tetris_screen;
}
</style>
