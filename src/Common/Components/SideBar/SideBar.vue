<template>
    <div @click="afterClick">
        <div class="sidebar-group">
            <nuxt-link to="/simulator/">{{
                $services.lang.t('Simulator')
            }}</nuxt-link>
        </div>
        <el-divider />
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
        <el-divider />
        <div class="sidebar-group">
            <a class="flag-link" href="#">
                <img
                    class="flag"
                    src="/static/flags/en.svg"
                    :alt="$services.lang.t('Switch to') + ' en'"
                />
                {{ $services.lang.t('English') }}
            </a>
            <a class="flag-link" href="#">
                <img
                    class="flag"
                    src="/static/flags/ru.svg"
                    :alt="$services.lang.t('Switch to') + ' ru'"
                />
                {{ $services.lang.t('Russian') }}
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useService } from '~~/src/Common/Helpers/HService'
import { SDrawer } from '~~/src/Common/Services/SDrawer'

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
