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

const openMenu = () => {}
</script>
