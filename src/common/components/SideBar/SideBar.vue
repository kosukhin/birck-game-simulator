<template>
  <div @click="afterClick">
    <div class="sidebar-group">
      <nuxt-link to="/simulator/">{{ $t('Simulator') }} </nuxt-link>
    </div>
    <el-divider>
      <el-icon>
        <star-filled />
      </el-icon>
    </el-divider>
    <div class="sidebar-group">
      <nuxt-link to="/translation/">{{ $t('Broadcasting online') }} </nuxt-link>
      <nuxt-link to="/about/">{{ $t('About project') }} </nuxt-link>
      <nuxt-link to="/new-game/">{{ $t('Create new game') }} </nuxt-link>
      <nuxt-link to="/documentation/">{{ $t('Documentation') }} </nuxt-link>
    </div>
    <el-divider>
      <el-icon>
        <star-filled />
      </el-icon>
    </el-divider>
    <div class="sidebar-group">
      <LangChanger />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { StarFilled } from '@element-plus/icons-vue'
import LangChanger from '~~/src/common/components/LangChanger/LangChanger.vue'

const afterClick = () => {}
</script>

<style lang="scss" scoped>
.sidebar-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
