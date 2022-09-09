<template>
    <div class="simulator middle">
        <h1>Игры</h1>
        <nuxt-link to="/simulator/tetris/">{{
            $services.lang.t('Tetris')
        }}</nuxt-link>
        <nuxt-link to="/simulator/snake/">{{
            $services.lang.t('Snake')
        }}</nuxt-link>
        <nuxt-link to="/simulator/tanks/">{{
            $services.lang.t('Tanks')
        }}</nuxt-link>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.simulator {
    display: flex;
    flex-direction: column;
}
</style>
