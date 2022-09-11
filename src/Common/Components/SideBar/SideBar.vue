<template>
    <div @click="afterClick">
        <div class="sidebar-group">
            <nuxt-link to="/simulator/">{{
                $services.lang.t('Simulator')
            }}</nuxt-link>
        </div>
        <el-divider>
            <el-icon>
                <star-filled />
            </el-icon>
        </el-divider>
        <div class="sidebar-group">
            <nuxt-link to="/about/">{{
                $services.lang.t('About project')
            }}</nuxt-link>
            <nuxt-link to="/new-game/">{{
                $services.lang.t('Create new game')
            }}</nuxt-link>
            <nuxt-link to="/documentation/">{{
                $services.lang.t('Documentation')
            }}</nuxt-link>
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

<script setup lang="ts">
import { StarFilled } from '@element-plus/icons-vue'
import { useService } from '~~/src/Common/Helpers/HService'
import { SDrawer } from '~~/src/Common/Services/SDrawer'
import LangChanger from '~~/src/Common/Components/LangChanger/LangChanger.vue'

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
