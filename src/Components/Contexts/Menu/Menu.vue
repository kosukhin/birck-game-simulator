<template>
    <div class="menu screen">
        <a class="menu_item" @click.prevent="$emit('open', 'start')" href="#">
            {{ $services.lang.t('Start game') }}
        </a>
        <a class="menu_item" @click.prevent="$emit('open', 'settings')" href="#">
            {{ $services.lang.t('Settings') }}
        </a>
    </div>
</template>

<style scoped>
    .menu_item {
        cursor: pointer;
    }
</style>
