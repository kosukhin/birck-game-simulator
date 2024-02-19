<template>
  <div @click="afterClick">
    <div class="sidebar-group">
      <nuxt-link to="/simulator/"
        >{{ 'Simulator' }}
      </nuxt-link>
    </div>
    <el-divider>
      <el-icon>
        <star-filled />
      </el-icon>
    </el-divider>
    <div class="sidebar-group">
      <nuxt-link to="/translation/"
        >{{ 'Broadcasting online' }}
      </nuxt-link>
      <nuxt-link to="/about/"
        >{{ 'About project' }}
      </nuxt-link>
      <nuxt-link to="/new-game/"
        >{{ 'Create new game' }}
      </nuxt-link>
      <nuxt-link to="/documentation/"
        >{{ 'Documentation' }}
      </nuxt-link>
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
import { useService } from '~~/src/common/utils/HService'
import { SDrawer } from '~~/src/Common/Services/SDrawer'
import LangChanger from '~~/src/common/components/LangChanger/LangChanger.vue'

const afterClick = () => {
  useService<SDrawer>('drawer').close('menu')
}
</script>

<style lang="scss" scoped>
.sidebar-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
