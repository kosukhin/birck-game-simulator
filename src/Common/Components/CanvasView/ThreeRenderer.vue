<template>
    <div>
        <div ref="canvas"></div>
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
const baseSize = 0.5
const spaceBetween = 0.2

const initThreeJs = () => {
    const height = 200
    const width = 150
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(
        width / -2,
        width / 2,
        height / 2,
        height / -2,
        1,
        1000
    )
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)
    canvas.value.appendChild(renderer.domElement)

    const geometry = new THREE.BoxGeometry(baseSize, baseSize, baseSize)
    const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa })

    const cubesGrid = []
    const gridArray = props.grid.render()
    let topOffset = 0
    let leftOffset = 0

    for (const row in gridArray) {
        if (!cubesGrid[row]) {
            cubesGrid[row] = []
        }

        for (const cell in gridArray[row]) {
            leftOffset += baseSize + spaceBetween
            cubesGrid[row][cell] = new THREE.Mesh(geometry, material)
            cubesGrid[row][cell].position.x = leftOffset - 5
            cubesGrid[row][cell].position.y = topOffset - 5
            scene.add(cubesGrid[row][cell])
            cubesGrid[row][cell].visible = true
        }

        topOffset += baseSize + spaceBetween
        leftOffset = 0
    }

    camera.position.z = 5

    function animate() {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
    }
    animate()
}

onMounted(initThreeJs)
</script>

<style scoped lang="scss"></style>
