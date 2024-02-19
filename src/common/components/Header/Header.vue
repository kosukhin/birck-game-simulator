<template>
  <header class="header">
    <div class="middle header-inner">
      <nuxt-link class="logo" to="/">
        <el-avatar :size="32" class="mr-3">
          <img alt="" src="/images/logo.jpg" />
        </el-avatar>
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
import { useService } from '~~/src/common/utils/HService'
import { SDrawer } from '~~/src/Common/Services/SDrawer'

const openMenu = () => {
  useService<SDrawer>('drawer').open({
    name: 'menu',
    component: () =>
      defineAsyncComponent(
        () => import('~~/src/common/components/SideBar/SideBar.vue')
      ),
    direction: 'rtl',
    options: [],
  })
}
</script>
