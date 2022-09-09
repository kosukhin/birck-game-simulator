<template>
    <header class="header">
        <div class="middle header-inner">
            <nuxt-link class="logo" to="/">
                <el-avatar :size="32" class="mr-3" src="/static/logo.jpg" />
                BrickGame
            </nuxt-link>
            <div class="menu" @click="openMenu">
                <el-icon>
                    <Menu />
                </el-icon>
            </div>
        </div>
    </header>
</template>

<script lang="ts" setup>
import { Menu } from '@element-plus/icons-vue'
import { useService } from '~~/src/Common/Helpers/HService'
import { SDrawer } from '~~/src/Common/Services/SDrawer'

const openMenu = () => {
    useService<SDrawer>('drawer').open({
        name: 'menu',
        component: () =>
            defineAsyncComponent(
                () => import('~~/src/Common/Components/SideBar/SideBar.vue')
            ),
        direction: 'rtl',
        options: [],
    })
}
</script>
