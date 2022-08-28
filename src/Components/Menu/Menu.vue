<template>
    <div class="menu screen">
        <a class="menu-item" href="#" @click.prevent="$emit('open', 'start')">
            {{ $services.lang.t('Start game') }}
        </a>
        <a
            class="menu-item"
            href="#"
            @click.prevent="$emit('open', 'settings')"
        >
            {{ $services.lang.t('Settings') }}
        </a>
    </div>
</template>

<style scoped>
.menu-item {
    cursor: pointer;
}
</style>
