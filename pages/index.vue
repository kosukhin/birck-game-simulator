<template>
    <div class="main">
        <nuxt-link to="/simulator/">{{
            $services.lang.t('Simulator')
        }}</nuxt-link>
    </div>
</template>

<style scoped>
.main {
    display: flex;
    flex-direction: column;
}
</style>
