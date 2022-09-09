<template>
    <div>
        <el-drawer
            v-for="(drawerValue, drawerName) in drawersHash"
            :key="drawerName"
            :model-value="drawerValue"
            :direction="drawersHashNotReactive[drawerName].direction"
            @closed="closed(drawerName)"
        >
            <div>
                <component
                    :is="drawersHashNotReactive[drawerName].component()"
                    :options="drawersHashNotReactive[drawerName].options"
                />
            </div>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { HApp } from '~~/src/Common/Helpers/HApp'
import { useService } from '~~/src/Common/Helpers/HService'
import { SDrawer, IDrawer } from '~~/src/Common/Services/SDrawer'

const drawersHashNotReactive: Record<string, IDrawer> = {}
const drawersHash: Ref<Record<string, boolean>> = ref({})
const drawerService = useService<SDrawer>('drawer')
const closed = (name: string) => {
    drawerService.close(name)
}

drawerService.opening.registerSubscriber((drawer) => {
    drawersHash.value[drawer.name] = true
    drawersHashNotReactive[drawer.name] = drawer
})

drawerService.closing.registerSubscriber((name) => {
    drawersHash.value[name] = false
    HApp.wait(300).then(() => {
        delete drawersHash.value[name]
        delete drawersHashNotReactive[name]
    })
})
</script>
