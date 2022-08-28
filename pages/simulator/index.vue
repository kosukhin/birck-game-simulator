<template>
    <div class="simulator">
        <nuxt-link to="/">Главная</nuxt-link>
        <nuxt-link to="/simulator/tetris/">Тетрис</nuxt-link>
        <nuxt-link to="/simulator/settings/">Настройки</nuxt-link>
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
