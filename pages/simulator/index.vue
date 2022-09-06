<template>
    <div class="simulator">
        <nuxt-link to="/">{{ $services.lang.t('Home') }}</nuxt-link>
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

<style lang="scss" scoped>
.simulator {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex: 1;
    height: 100%;
}
</style>
