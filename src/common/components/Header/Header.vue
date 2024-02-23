<template>
  <header class="header">
    <div class="middle header-inner">
      <nuxt-link class="logo" to="/">
        <el-avatar :size="32" class="mr-3">
          <img alt="" src="/images/logo.jpg" />
        </el-avatar>
        BrickGame
      </nuxt-link>
      <div class="menu" @click="isMenuOpened = true">
        <el-icon>
          <Menu />
        </el-icon>
      </div>
    </div>
    <el-drawer
      direction="rtl"
      :model-value="isMenuOpened"
      :size="device.isMobile ? '100%' : '30%'"
      @closed="isMenuOpened = false"
    >
      <div>
        <component :is="sidebarComponent" />
      </div>
    </el-drawer>
  </header>
</template>

<script lang="ts" setup>
import { Menu } from '@element-plus/icons-vue'
import { useDevice } from '~/src/common/composables/useDevice'

const isMenuOpened = ref(false)
const device = useDevice()

const sidebarComponent = defineAsyncComponent(
  () => import('~~/src/common/components/SideBar/SideBar.vue')
)
</script>
